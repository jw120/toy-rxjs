import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

// Second observable runs through a series of modes
interface QueueState { // (must be an object so can be mutated by the functions it is passed to)
  state: 'Queue'   // Initially the second subscribe method diverts all events into a queue
       | 'Dequeue' // When first subscribe completes, second has to use all the events ints a queue
       | 'Normal'  // After Dequeue, second subscribe runs normally
       | 'Finish'; // If there is an error in first subscribe we skip the second
}

export function concat<T>(first: SubscribeFn<T>, second: SubscribeFn<T>): Observable<T> {

  return new Observable<T>((o: Observer<T>): TearDownLogic => {

    // mutable state shared between the two subscribe functions
    let secondState: QueueState = { state: 'Queue' };

    // hold the subscriptions here so they can be called

    let firstSub: Subscription = Subscription.EMPTY;
    firstSub = subscribe(first, advanceOnEnd<T>(o, secondState, firstSub));
    return subscribe(second, addQueue<T>(o, secondState));

  });

}

// Advance the queue state (mutably) on error/complete
function advanceOnEnd<T>(o: Observer<T>, nextState: QueueState, sub: Subscription): Observer<T> {

  return {

    next: (x: T): void => {
      o.next(x);
    },

    error: (e: Error): void => {
      o.error(e);
      sub.unsubscribe();
      if (nextState.state === 'Queue') {
        nextState.state = 'Finish';
      }
    },

    complete: (): void => {
      sub.unsubscribe();
      if (nextState.state === 'Queue') {
        nextState.state = 'Dequeue';
      }
    }
  };
}

// We store events from the second observable while first is active
type QueueItem<T>
  = { type: 'Next', value: T }
  | { type: 'Error', value: Error }
  | { type: 'Complete' };

function addQueue<T>(o: Observer<T>, state: QueueState): Observer<T> {

  let queue: Array<QueueItem<T>> = [];

  // Flush all the queue items (don't bother continuing after first error/complete)
  function flushQueue(): void {
    let finished: boolean = false;
    let i: number = 0;
    while (i < queue.length && !finished) {
      let q: QueueItem<T> = queue[i];
      switch (q.type) {
        case 'Next': o.next(q.value); break;
        case 'Error': o.error(q.value); finished = true; break;
        case 'Complete': o.complete(); finished = true; break;
        default:
          throw Error('Unknown type in concat dequeuing'); // Should not be possible
      }
    }
  }

  return {

      next: (x: T): void => {
        switch (state.state) {
          case 'Queue':
            queue.push({ type: 'Next', value: x });
            break;
          case 'Dequeue':
            flushQueue();
            state.state = 'Normal';
            o.next(x);
            break;
          case 'Normal':
            o.next(x);
            break;
          default:
            break;
        }
      },

     error: (e: Error): void => {
        switch (state.state) {
          case 'Queue':
            queue.push({ type: 'Error', value: e });
            break;
          case 'Dequeue':
            flushQueue();
            state.state = 'Normal';
            o.error(e);
            break;
          case 'Normal':
            o.error(e);
            break;
          default:
            break;
        }
      },

    complete: (): void => {
      switch (state.state) {
          case 'Queue':
            queue.push({ type: 'Complete'});
            break;
          case 'Dequeue':
            flushQueue();
            state.state = 'Normal';
            o.complete();
            break;
          case 'Normal':
            o.complete();
            break;
          default:
            break;
        }
      }
  }
}
