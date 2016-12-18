import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

//
function flattenMapSimple<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  flatten: (o: Observable<Observable<U>>) => Observable<V>
  ): Observable<V> {

  return flatten((new Observable(first)).map(project));

}

export function concatMapSimple<T, U, V>(
  first: SubscribeFn<T>, project: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(first, project, (o: Observable<Observable<U>>) => o.concatAll());
}

export function exhaustMapSimple<T, U, V>(
  first: SubscribeFn<T>, project: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(first, project, (o: Observable<Observable<U>>) => o.exhaust());
}

export function mergeMapSimple<T, U, V>(
  first: SubscribeFn<T>, project: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(first, project, (o: Observable<Observable<U>>) => o.mergeAll());
}

export function switchMapSimple<T, U, V>(
  first: SubscribeFn<T>, project: (x: T, i: number) => Observable<U>): Observable<V> {
  return flattenMapSimple(first, project, (o: Observable<Observable<U>>) => o.switch());
}

export function concatMapFull<T, U, V>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>,
  resultSelector?: (outerVal: T, innerVal: U, outerIndex: number, innerIndex: number) => V
): Observable<V> {

  interface Result {
    outerVal: T;
    innerVal: U;
    outerIndex: number;
    innerIndex: number;
  }

  function resultMap(outerVal: T, outerIndex: number): Observable<Result> {
    return project(outerVal, outerIndex).map((innerVal: U, innerIndex: number) =>
      ({ outerVal, innerVal, outerIndex, innerIndex }));
  }

  return (new Observable(first))
      .map(resultMap)
      .concatAll()
      .map((r: Result) => resultSelector(r.outerVal, r.innerVal, r.outerIndex, r.innerIndex));

}
