import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

export function scan<T, U>(
  first: SubscribeFn<T>,
  accumulator: (acc: U, x: T) => U,
  seed: U
): Observable<U> {

  let acc: U = seed;

  return new Observable((o: Observer<U>): TearDownLogic => first({
    next: (x: T): void => { acc = accumulator(acc, x); o.next(acc); },
    error: o.error,
    complete: o.complete
  }));

}

export function scan1<T>(
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
      o.next(acc);
    },
    error: o.error,
    complete: o.complete
  }));

}
