import { Observable, SubscribeFn, TearDown } from '../Observable';
import { Observer } from '../Observer';

export function take<T>(first: SubscribeFn<T>, n: number): Observable<T> {

  return new Observable<T>((o: Observer<T>): TearDown => {
    let count: number = 0;
    return first({
      next: (x: T): void => {
        if (count++ < n) {
          o.next(x);
        }
        if (count === n) {
          o.complete();
        }
      },
      error: o.error,
      complete: o.complete
    });
  });

}
