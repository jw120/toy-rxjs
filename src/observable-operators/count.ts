import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

export function count<T>(
  first: Observable<T>,
  predicate?: (value: T, index: number, source: Observable<T>) => boolean
): Observable<number> {

  let count: number = 0;
  let i: number = 0;

  return new Observable((o: Observer<number>): TearDownLogic => first._subscribe({
    next: (x: T): void => {
      if (predicate === undefined || predicate(x, i, first)) {
        count++;
      }
      i++;
    },
    error: o.error,
    complete: () => { o.next(count); o.complete(); }
  }));

}
