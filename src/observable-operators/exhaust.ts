import { Observable , SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Flatten a higher-order observable of observables by ignoring concurrent emits */
export function exhaust<T>(first: SubscribeFn<Observable<T>>): Observable<T> {

  return new Observable((rawFlatObserver: Observer<T>): TearDownLogic => {

    interface State {
      higher: 'Running' // Higher observable is still adding new flat tasks
            | 'Waiting' // Higher observable has completed but we are waiting for flat tasks to finish
            | 'Done';   // Triggered by end of task queue or an error
      flat: boolean; // Do we have an active flat observable
    }
    let state: State = {
      higher: 'Running',
      flat: false
    };
    let higherSubscription: Subscription = null;

    const higherObserver: Observer<Observable<T>> = {

      next: (flatObservable: Observable<T>) => {
        if (state.higher === 'Running' && !state.flat) {
          const flatObserver: Observer<T> = {
            next: (x: T) => rawFlatObserver.next(x) ,
            error: (e: Error) => { state.higher = 'Done'; rawFlatObserver.error(e); },
            complete: () => {
              state.flat = false;
              if (state.higher === 'Waiting') {
                state.higher = 'Done';
                rawFlatObserver.complete();
              }
            }
          };
          state.flat = true;
          subscribe(flatObservable._subscribe, flatObserver);
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
          if (state.flat) {
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
