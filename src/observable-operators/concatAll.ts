import { Observable , SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Converts a higher-order observable of observables into an observable */
export function concatAll<T>(first: SubscribeFn<Observable<T>>): Observable<T> {

  return new Observable((rawFlatObserver: Observer<T>): TearDownLogic => {

    interface State {
      higher: 'Running' // Higher observable is still adding new flat tasks to the queue
            | 'Waiting' // Higher observable has completed but we are waiting for flat tasks to finish
            | 'Done';   // Triggered by end of task queue or an error
      flatRunning: boolean; // set true when we start a flat task (to avoid mixing them)
    }

    let state: State = {
      higher: 'Running',
      flatRunning: false
    };
    let flatObservableQueue: Array<Observable<T>> = [];
    let higherSubscription: Subscription = null;

    const flatObserver: Observer<T> = {
        next: (x: T) => rawFlatObserver.next(x) ,
        error: (e: Error) => { state.higher = 'Done'; rawFlatObserver.error(e); }
      };

    function processQueue(): void {
      if (!state.flatRunning) {
        if (flatObservableQueue.length === 0) {
          if (state.higher === 'Waiting') {
            state.higher = 'Done';
            rawFlatObserver.complete();
            if (higherSubscription) {
              higherSubscription.unsubscribe();
              higherSubscription = null;
            }
          }
        } else {
          state.flatRunning = true;
          subscribe(flatObservableQueue[0]._subscribe, flatObserver, () => {
            state.flatRunning = false;
            flatObservableQueue.shift();
            processQueue();
          });
        }
      }
    }

    const higherObserver: Observer<Observable<T>> = {

      next: (flatObservable: Observable<T>) => {
        if (state.higher === 'Running') {
          flatObservableQueue.push(flatObservable);
          processQueue();
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
          state.higher = 'Waiting';
          processQueue();
        }
      }
    };

    higherSubscription = subscribe(first, higherObserver);
    if (state.higher === 'Done' && higherSubscription) {
      higherSubscription.unsubscribe();
    }

  });

}
