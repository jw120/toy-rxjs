import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { TearDownLogic } from '../utils/TearDownLogic';

export function concatMapSimple<T, U>(
  first: SubscribeFn<T>,
  project: (x: T, i: number) => Observable<U>
  ): Observable<U> {

  return (new Observable(first))
    .map(project)
    .concatAll();

}

export function concatMap<T, U, V>(
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
