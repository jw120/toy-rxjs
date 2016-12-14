import { Observable , SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Flatten a higher-order observable of observables by only listening to the most recent */
export function switchFn<T>(first: SubscribeFn<Observable<T>>): Observable<T> {

  return new Observable((rawFlatObserver: Observer<T>): TearDownLogic => {

    interface State {
      higher: 'Running' // Higher observable is still adding new flat tasks
            | 'Waiting' // Higher observable has completed but we are waiting for flat tasks to finish
            | 'Done';   // Triggered by end of task queue or an error
      flatRunning: boolean; // Is there an active flat observable that we need to track
      flatIndex: number; // Index of that most recent flat observable
    }
    let state: State = {
      higher: 'Running',
      flatRunning: false,
      flatIndex: 0
    };
    let higherSubscription: Subscription = null;

    function startFlat(o: Observable<T>, i: number): void {

      state.flatRunning = true;
      state.flatIndex = i;
      const flatObserver: Observer<T> = {
        next: (x: T) => {
          if (state.flatRunning && state.flatIndex === i) {
            rawFlatObserver.next(x);
          }
        },
        error: (e: Error) => {
          if (state.flatRunning && state.flatIndex === i) {
            state.higher = 'Done';
            rawFlatObserver.error(e);
          }
        },
        complete: () => {
          if (state.flatRunning && state.flatIndex === i) {
            state.flatRunning = false;
            if (state.higher === 'Waiting') {
              state.higher = 'Done';
              rawFlatObserver.complete();
            }
          }
        }
      };
      subscribe(o._subscribe, flatObserver);
    }

    const higherObserver: Observer<Observable<T>> = {

      next: (flatObservable: Observable<T>) => {
        if (state.higher === 'Running') {
          startFlat(flatObservable, ++state.flatIndex);
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
          if (state.flatRunning) {
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
