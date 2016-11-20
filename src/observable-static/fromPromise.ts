/**
 *
 * Creating an Observable from an iterator (and related functions)
 *
 */

import { Observable } from '../Observable';
import { Observer } from '../Observer';

// Observable from a Promise
export function fromPromise<T>(p: Promise<T>): Observable<T> {
  return Observable.create((o: Observer<T>): void => {
    p.then(
      (x: T) => { o.next(x); o.complete(); },
      (e: Error) => { o.error(e); }
    );
  });
}
