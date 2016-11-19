import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

// Returns an observable whose values are those of this observable with the project function applied
export function map<T, U>(first: SubscribeFn<T>, project: (x: T) => U): Observable<U> {

  return new Observable((o: Observer<U>): TearDownLogic => first({
    next: (x: T): void => o.next(project(x)),
    error: o.error,
    complete: o.complete
  }));

}
