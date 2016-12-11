import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Returns an observable whose values are those of this observable with the project function applied */
export function reduce<T, U>(
  first: SubscribeFn<T>,
  accumulator: (acc: U, x: T) => U,
  seed: U
): Observable<U> {

  let acc: U = seed;

  return new Observable((o: Observer<U>): TearDownLogic => first({
    next: (x: T): void => { acc = accumulator(acc, x); },
    error: o.error,
    complete: () => { o.next(acc); o.complete(); }
  }));

}

export function reduce1<T>(
  first: SubscribeFn<T>,
  accumulator: (acc: T, x: T) => T
): Observable<T> {

  let accSet: boolean = false;
  let acc: T = undefined;

  return new Observable((o: Observer<T>): TearDownLogic => first({
    next: (x: T): void => {
      if (accSet) {
        acc = accumulator(acc, x);
      } else {
        acc = x;
        accSet = true;
      }
    },
    error: o.error,
    complete: () => { o.next(acc); o.complete(); }
  }));

}
