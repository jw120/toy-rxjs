/**
 *
 * Defines static functional version of Observable.never
 *
 */

import { Observable } from '../Observable';

/** Creates an Observable that emits no items to the Observer */
export function never<T>(): Observable<T> {
  return new Observable((): void => { /* do nothing */ });
}
