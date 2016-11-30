import { Observable , SubscribeFn } from '../Observable';
import { Observer } from '../Observer';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Converts a higher-order observable of observables into an observable */
export function concatAll<T>(first: SubscribeFn<Observable<T>>): Observable<T> {

  return new Observable((rawFlatObserver: Observer<T>): TearDownLogic => {

    let foundError: boolean = false;

    const higherObserver: Observer<Observable<T>> = {

      next: (flatObservable: Observable<T>) => {
        if (!foundError) {
          console.log('higher next');
          const flatObserver: Observer<T> = {
            next: (x: T) => { console.log('flat next', x); rawFlatObserver.next(x); },
            error: (e: Error) => { console.log('flat error', e.message); foundError = true; rawFlatObserver.error(e); },
            complete: () => { console.log('flat (complete)'); /* rawFlatObserver.complete(); */ }
          };
          flatObservable.subscribe(flatObserver);
        }
      },

      error: (e: Error) => {
        if (!foundError) {
          console.log('higher error');
          foundError = true;
          rawFlatObserver.error(e);
        }
      },

      complete: () => {
        if (!foundError) {
          console.log('higher complete');
          rawFlatObserver.complete();
          // flatObserver.complete();
        }

      }
    };

    subscribe(first, higherObserver);

  });

}

/** Convert a higher-order observable to a normal observable by concatenating all output */
export function flatten<T>(higherObservable: Observable<Observable<T>>): Observable<T> {

  return new Observable((flatObserver: Observer<T>): TearDownLogic => {

    const higherObserver: Observer<Observable<T>> = {
      next: (flatObservable: Observable<T>) => {
        console.log('higher next');
        flatObservable.subscribe((x: T) => {
          console.log('flat next', x);
          flatObserver.next(x);
        });
      },
      complete: () => {
        console.log('higher complete');
        flatObserver.complete();
      }
    };

    subscribe(higherObservable._subscribe, higherObserver);

  });

}
