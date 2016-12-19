// Implementation for map-and-flatten operators: concatMap, exhaustMap, mergeMap, switchMap

import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

// Generic version without a selector function
function flattenMapSimple<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  flatten: (o: Observable<Observable<U>>) => Observable<V>
  ): Observable<V> {

  return (new Observable(first))
    .map(project)
    .let(flatten);

}

// Specifc versions just call flattenMapSimple with the appropriate flattening function
export function concatMapSimple<T, U, V>(f: SubscribeFn<T>, p: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(f, p, (o: Observable<Observable<U>>) => o.concatAll());
}
export function exhaustMapSimple<T, U, V>(f: SubscribeFn<T>, p: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(f, p, (o: Observable<Observable<U>>) => o.exhaust());
}
export function mergeMapSimple<T, U, V>(f: SubscribeFn<T>, p: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(f, p, (o: Observable<Observable<U>>) => o.mergeAll());
}
export function switchMapSimple<T, U, V>(f: SubscribeFn<T>, p: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(f, p, (o: Observable<Observable<U>>) => o.switch());
}

// Wrapper type used to hold extra variables needed for resultSelector
interface Result<X, Y> {
  outerVal: X;
  innerVal: Y;
  outerIndex: number;
  innerIndex: number;
}

// Generic version with a selector function
function flattenMapFull<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  resultSelector: (outVal: T, innerVal: U, outerIndex: number, innerIndex: number) => V,
  flatten: (o: Observable<Observable<Result<T, U>>>) => Observable<Result<T, U>>
): Observable<V> {

  function resultMap(outerVal: T, outerIndex: number): Observable<Result<T, U>> {
    return project(outerVal, outerIndex).map((innerVal: U, innerIndex: number) =>
      ({ outerVal, innerVal, outerIndex, innerIndex }));
  }

  return (new Observable(first))
      .map(resultMap)
      .let(flatten)
      .map((r: Result<T, U>) => resultSelector(r.outerVal, r.innerVal, r.outerIndex, r.innerIndex));
}

// Specifc versions just call flattenMapFull with the appropriate flattening function
export function concatMapFull<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  resultSelector: (outVal: T, innerVal: U, outerIndex: number, innerIndex: number) => V
): Observable<V> {
  return flattenMapFull(first, project, resultSelector,
    (o: Observable<Observable<Result<T, U>>>) => o.concatAll()
  );
}
export function exhaustMapFull<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  resultSelector: (outVal: T, innerVal: U, outerIndex: number, innerIndex: number) => V
): Observable<V> {
  return flattenMapFull(first, project, resultSelector,
    (o: Observable<Observable<Result<T, U>>>) => o.exhaust()
  );
}
export function mergeMapFull<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  resultSelector: (outVal: T, innerVal: U, outerIndex: number, innerIndex: number) => V
): Observable<V> {
  return flattenMapFull(first, project, resultSelector,
    (o: Observable<Observable<Result<T, U>>>) => o.mergeAll()
  );
}
export function switchMapFull<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  resultSelector: (outVal: T, innerVal: U, outerIndex: number, innerIndex: number) => V
): Observable<V> {
  return flattenMapFull(first, project, resultSelector,
    (o: Observable<Observable<Result<T, U>>>) => o.switch()
  );
}
