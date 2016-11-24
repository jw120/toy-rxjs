/**
 *
 * Defines static functional version of Observable.never
 *
 */

import { Observable } from '../Observable';
import { Observer } from '../Observer';

/**  Creates an Observable from an unresolved promise that passes next and complete on resolution and
 * passes errror on rejecting with an Error
 */
export function fromPromise<T>(p: Promise<T>): Observable<T> {
  return Observable.create((o: Observer<T>): void => {
    p.then((v: T) => {
      o.next(v);
      o.complete();
    }).catch(o.error);
  });
}
