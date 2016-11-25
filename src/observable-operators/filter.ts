import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Returns an observable whose values are those of this observable which satisfy the predicate */
export function filter<T>(first: SubscribeFn<T>, predicate: (x: T, i: number) => boolean): Observable<T> {

  let index: number = 0;

  return new Observable((o: Observer<T>): TearDownLogic => first({
    next: (x: T): void => {
      if (predicate(x, index++)) {
        o.next(x);
      }
    },
    error: o.error,
    complete: o.complete
  }));

}
