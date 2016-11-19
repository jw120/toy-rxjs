import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

// We run through 3 modes: start with the first observable active (with any values from the
// second going into a queue), then the second observable becomes active, then none are active
// (this is an object so can be modified when passed as a function argument)
interface State {
  state: 'First' | 'Second' | 'None';
}

// We store events from the second observable while first is active
type QueueItem<T>
  = { type: 'Next', value: T }
  | { type: 'Error', value: Error }
  | { type: 'Complete' };

export function concat<T>(first: SubscribeFn<T>, second: SubscribeFn<T>): Observable<T> {

  return new Observable<T>((o: Observer<T>): TearDownLogic => {

    let state: State = { state: 'First' };
    let queue: QueueItem<T>[] = [];

    let firstSub: Subscription = subscribe(first, patchFirstObserver<T>(o, state, queue));
    let secondSub: Subscription = subscribe(second, patchSecondObserver<T>(o, state, queue));
    return firstSub.add(secondSub);

  });

}

function patchFirstObserver<T>(o: Observer<T>, state: State, queue: QueueItem<T>[]): Observer<T> {

  return {

    // If first still active, just pass on values - otherwise ignore
    next: (x: T): void => (state.state === 'First') && o.next(x),

    // If first still active, error is passed on and stops
    error: (e: Error): void => { if (state.state === 'First') { state.state = 'None'; o.error(e); } },

    // If first still active, complete makes second observable active and first empties the queue
    complete: (): void => {
      if (state.state === 'First') {
        state.state = 'Second';
        queue.forEach((q: QueueItem<T>) => {
          if (state.state === 'Second') {
            if (q.type === 'Next') {
              o.next(q.value);
            } else if (q.type === 'Error') {
              o.error(q.value);
              state.state = 'None';
            } else if (q.type === 'Complete') {
              o.complete();
              state.state = 'None';
            } else {
              throw Error('Unknown type in concat dequeuing'); // Should not be possible
            }
          }
        });
      }
    }
  };
}

function patchSecondObserver<T>(o: Observer<T>, state: State, queue: QueueItem<T>[]): Observer<T> {

  return {

      next: (x: T): void => {
        if (state.state === 'First') {
          queue.push({ type: 'Next', value: x });
        } else if (state.state === 'Second') {
          o.next(x);
        }
      },
      error: (e: Error): void => {
        if (state.state === 'First') {
          queue.push({ type: 'Error', value: e });
        } else if (state.state === 'Second') {
          state.state = 'None';
          o.error(e);
        }
      },
      complete: (): void => {
        if (state.state === 'First') {
          queue.push({ type: 'Complete' });
        } else if (state.state === 'Second') {
          state.state = 'None';
          o.complete();
        }
      }
  };
}
