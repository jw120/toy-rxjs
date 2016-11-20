import { Observer } from './Observer';
import { Subscription } from './Subscription';

import { interval, timer } from './observable-static/async';
import { empty, of } from './observable-static/iterable';
import { never } from './observable-static/never';

import { range } from './observable-static/sync';
import { staticThrow } from './observable-static/throw';

import { concat } from './observable-operators/concat';
import { map } from './observable-operators/map';
import { subscribe } from './observable-operators/subscribe';
import { take } from './observable-operators/take';

import { TearDownLogic } from './utils/TearDownLogic';

export interface Subscription {
  unsubscribe: () => void;
}

export type SubscribeFn<T> = (o: Observer<T>) => TearDownLogic;

export class Observable<T> {

  // Observable implementation centred on its subscribe function
  private _subscribe: SubscribeFn<T>;

  constructor(sub: SubscribeFn<T>) {
    this._subscribe = sub;
  }

  // Static methods pulled in from observable-static
  static create<T>(createFn: SubscribeFn<T>): Observable<T> { return new Observable(createFn); }
  static of<T>(...args: T[]): Observable<T> { return of(...args); }
  static throw<T>(e: Error): Observable<T> { return staticThrow(e); }
  static empty<T>(): Observable<T> { return empty(); }
  static never<T>(): Observable<T> { return never(); }
  static range(start: number, count: number): Observable<number> { return range(start, count); }
  static interval(period: number): Observable<number> { return interval(period); }
  static timer(delay: number | Date, period: number): Observable<number> { return timer(delay, period); }

  // operators pulled in from observable-operators (where they are defined as functions on SubscribeFns)
  map<U>(project: (x: T) => U): Observable<U> { return map(this._subscribe, project); }
  concat(o: Observable<T>): Observable<T> { return concat(this._subscribe, o._subscribe); }
  take(n: number): Observable<T> { return take(this._subscribe, n); }

  // Subscribe method - needs to handle function form as well as observable
  subscribe(o: Observer<T>): Subscription;
  subscribe(nextFn: (x: T) => void, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription;
  subscribe(a: ((x: T) => void)| Observer<T>, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription {
    return subscribe(this._subscribe, (typeof a === 'object') ? a : {
        next: a,
        error: errorFn || ((): void => { /* nothing */ }),
        complete: completeFn || ((): void => { /* nothing */ })
    });

  }

}
