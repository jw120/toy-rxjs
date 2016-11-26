/**
 *
 * Creating an Observable from an iterator (and related functions)
 *
 */

import { Observable } from '../Observable';
import { Scheduler } from '../Scheduler';

import { fromIterable, fromIterator } from './iterator';
import { fromPromise } from './fromPromise';

export function from<T>(x: Observable<T>, scheduler?: Scheduler): Observable<T>;
export function from<T>(x: Promise<T>, scheduler?: Scheduler): Observable<T>;
export function from<T>(x: Iterable<T>, scheduler?: Scheduler): Observable<T>;
export function from<T>(x: Iterator<T>, scheduler?: Scheduler): Observable<T>;
export function from(x: string, scheduler?: Scheduler): Observable<string>;
export function from(x: any, scheduler?: Scheduler): any {
  if (x instanceof Observable) {
    return x;
  }
  if (typeof x[Symbol.iterator] === 'function') {
    return fromIterable(x, 0, scheduler);
  }
  if (typeof x.next === 'function') {
    return fromIterator(x, 0, scheduler);
  }
  if (typeof x.then === 'function') {
    return fromPromise(x);
  }
  if (typeof x === 'string') {
    return fromIterable(x.split(''), 0, scheduler);
  }
  if (typeof x.length === 'number') { // array-like
    return fromIterable(Array.prototype.slice.call(x), 0, scheduler);
  }
  throw Error(`Unknown type in from: ${x}`);
}
