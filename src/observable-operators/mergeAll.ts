import { Observable , SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

export function mergeAll<T>(first: SubscribeFn<Observable<T>>): Observable<T> {

  return new Observable((rawFlatObserver: Observer<T>): TearDownLogic => {

    interface State {
      higher: 'Running' // Higher observable is still adding new flat tasks
            | 'Waiting' // Higher observable has completed but we are waiting for flat tasks to finish
            | 'Done';   // Triggered by end of task queue or an error
      flatIndex: number; // We give each flatObservable a number when we subscribe to it
      runningList: Array<number>; // And keep a list of active flatObservables - we complete when no more
    }
    let state: State = {
      higher: 'Running',
      flatIndex: 0,
      runningList: []
    };
    let higherSubscription: Subscription = null;

    function popRunningList(i: number): void {
      state.runningList = state.runningList.filter((x: number): boolean => x !== i);
      if (state.runningList.length === 0 && state.higher === 'Waiting') {
        rawFlatObserver.complete();
        state.higher = 'Done';
      }
    }

    function startFlatObservable(o: Observable<T>, i: number): void {
      const flatObserver: Observer<T> = {
        next: (x: T) => rawFlatObserver.next(x) ,
        error: (e: Error) => { state.higher = 'Done'; rawFlatObserver.error(e); },
        complete: () => { popRunningList(i); }
      };
      state.runningList.push(i);
      subscribe(o._subscribe, flatObserver);
    }

    const higherObserver: Observer<Observable<T>> = {

      next: (flatObservable: Observable<T>) => {
        if (state.higher === 'Running') {
          startFlatObservable(flatObservable, state.flatIndex++);
        }
      },

      error: (e: Error) => {
        if (state.higher === 'Running') {
          state.higher = 'Done';
          rawFlatObserver.error(e);
        }
      },

      complete: () => {
        if (state.higher === 'Running') {
          if (state.runningList.length > 0) {
            state.higher = 'Waiting';
          } else {
            state.higher = 'Done';
            rawFlatObserver.complete();
          }
        }
      }
    };

    higherSubscription = subscribe(first, higherObserver);
    if (state.higher === 'Done' && higherSubscription) {
      higherSubscription.unsubscribe();
    }

  });

}
