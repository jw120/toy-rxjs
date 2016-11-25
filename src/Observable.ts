import { Observer } from './Observer';
import { Subscription } from './Subscription';

import { empty, interval, of, range } from './observable-static/iterator';
import { never } from './observable-static/never';
import { from } from './observable-static/from';
import { fromPromise } from './observable-static/fromPromise';
import { staticThrow } from './observable-static/throw';
import { timer } from './observable-static/timer';

import { concat } from './observable-operators/concat';
import { filter } from './observable-operators/filter';
import { map } from './observable-operators/map';
import { subscribe } from './observable-operators/subscribe';
import { take } from './observable-operators/take';

import { Scheduler } from './Scheduler';
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

  //
  // Static methods pulled in from observable-static
  //

  static create<T>(createFn: SubscribeFn<T>): Observable<T> {
    return new Observable(createFn);
  }

  // If TypeScript allowed, type whould be:
  // static of(...args: T[], scheduler?: Scheduler )
  static of<T>(...args: any[]): Observable<T> {
    return of(...args);
  }

  static empty<T>(scheduler?: Scheduler): Observable<T> {
    return empty(scheduler);
  }

  static from<T>(x: Iterable<T>, scheduler?: Scheduler): Observable<T>;
  static from<T>(x: Iterator<T>, scheduler?: Scheduler): Observable<T>;
  static from<T>(x: Promise<T>, scheduler?: Scheduler): Observable<T>;
  static from(x: string, scheduler?: Scheduler): Observable<string>;
  static from(x: any, scheduler?: Scheduler): any {
    return from(x, scheduler);
  }

  static fromPromise<T>(promise: Promise<T>): Observable<T> {
    return fromPromise(promise);
  }

  static interval(period: number, scheduler?: Scheduler): Observable<number> {
    return interval(period, scheduler);
  }

  static never<T>(): Observable<T> {
    return never();
  }

  static range(start: number, count: number, scheduler?: Scheduler): Observable<number> {
    return range(start, count, scheduler);
  }

  static timer(delay: number | Date, period?: number): Observable<number> {
    return timer(delay, period);
  }
  static throw<T>(e: Error, scheduler?: Scheduler): Observable<T> {
    return staticThrow(e, scheduler);
  }

  //
  // Operators pulled in from observable-operators (where they are defined as functions on SubscribeFns)
  //

  concat(o: Observable<T>): Observable<T> {
    return concat(this._subscribe, o._subscribe);
  }

  filter(predicate: (x: T) => boolean): Observable<T> {
    return filter(this._subscribe, predicate);
  }

  map<U>(project: (x: T, i: number) => U): Observable<U> {
    return map(this._subscribe, project);
  }

  take(n: number): Observable<T> {
    return take(this._subscribe, n);
  }

  //
  // Methods defined here
  //

  /** Returns an observable which is the result of applying the given function to this observable */
  let<U>(fn: (obs: Observable<T>) => Observable<U>): Observable<U> {
    return fn(this);
  }

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
