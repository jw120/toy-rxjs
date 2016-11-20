/**
 *
 * Create the most trivial Observable
 *
 */

import { Observable } from '../Observable';

export function never<T>(): Observable<T> {
  return new Observable((): void => { /* do nothing */ });
}
