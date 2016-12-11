import { Observer } from './Observer';
import { Subscription } from './Subscription';

import { empty, interval, of, range } from './observable-static/iterator';
import { never } from './observable-static/never';
import { from } from './observable-static/from';
import { fromPromise } from './observable-static/fromPromise';
import { staticThrow } from './observable-static/throw';
import { timer } from './observable-static/timer';

import { combineLatest } from './observable-operators/combineLatest';
import { concat } from './observable-operators/concat';
import { concatAll } from './observable-operators/concatAll';
import { concatMapFull, concatMapSimple } from './observable-operators/concatMap';
import { count } from './observable-operators/count';
import { filter } from './observable-operators/filter';
import { map } from './observable-operators/map';
import { reduce, reduce1 } from './observable-operators/reduce';
import { scan, scan1 } from './observable-operators/scan';
import { subscribe } from './observable-operators/subscribe';
import { take } from './observable-operators/take';

import { Scheduler } from './Scheduler';
import { TearDownLogic } from './utils/TearDownLogic';

export interface Subscription {
  unsubscribe: () => void;
}

export type SubscribeFn<T> = (o: Observer<T>) => TearDownLogic;

interface Operator<T, R> {

}

export class Observable<T> {

  // Observable implementation centred on its subscribe function
  public _subscribe: SubscribeFn<T>;

  constructor(sub?: SubscribeFn<T>) {
    this._subscribe = sub || ((): void => { /* nothing */ });
  }

  //
  // Static methods pulled in from observable-static
  //

  static create<T>(createFn: SubscribeFn<T>): Observable<T> {
    return new Observable(createFn);
  }

  // If TypeScript allowed, type whould be:
  // static of(...args: T[], scheduler?: Scheduler )
  static of<T>(...args: Array<any>): Observable<T> {
    return of(...args);
  }

  static empty<T>(scheduler?: Scheduler): Observable<T> {
    return empty(scheduler);
  }

  static from<T>(x: Observable<T>, scheduler?: Scheduler): Observable<T>;
  static from<T>(x: Promise<T>, scheduler?: Scheduler): Observable<T>;
  static from<T>(x: Iterable<T>, scheduler?: Scheduler): Observable<T>;
  static from<T>(x: Iterator<T>, scheduler?: Scheduler): Observable<T>;
  static from<T>(x: string, scheduler?: Scheduler): Observable<string>;
  static from<T>(x: any, scheduler?: Scheduler): any {
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

  combineLatest<U>(o: Observable<U>): Observable<[T, U]>;
  combineLatest<U, V>(o: Observable<U>, project: (t: T, u: U) => V): Observable<V>;
  combineLatest<U, V>(o: Observable<U>, project?: (t: T, u: U) => V): Observable<any> {
    return combineLatest(this._subscribe, o._subscribe, project);
  }

  concat(o: Observable<T>): Observable<T> {
    return concat(this._subscribe, o._subscribe);
  }

  // LIMITATION: Cannot seem to express this type: should take Observable<Observable<T>> to an Observable<T>
  concatAll<U>(): Observable<U> {
    return concatAll(this._subscribe as any);
  }

  concatMap<U, V>(
    project: (x: T, i: number) => Observable<U>,
    resultSelector?: (x: T, y: U, i: number, j: number) => V): Observable<V> {
    if (resultSelector === undefined) {
      return concatMapSimple<T, U, V>(this._subscribe, project);
    } else {
      return concatMapFull<T, U, V>(this._subscribe, project, resultSelector);
    }
  }

  count(predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<number> {
    return count(this, predicate);
  }

  filter(predicate: (x: T) => boolean): Observable<T> {
    return filter(this._subscribe, predicate);
  }

  map<U>(project: (x: T, i: number) => U): Observable<U> {
    return map(this._subscribe, project);
  }

  reduce(accumulator: (acc: T, x: T) => T): Observable<T>;
  reduce<R>(accumulator: (acc: R, x: T) => R, seed: R): Observable<R>;
  reduce<R>(accumulator: any, seed?: any): Observable<any> {
    if (arguments.length > 1) {
      return reduce(this._subscribe, accumulator, seed);
    } else {
      return reduce1<T>(this._subscribe, accumulator);
    }
  }

  scan(accumulator: (acc: T, x: T) => T): Observable<T>;
  scan<R>(accumulator: (acc: R, x: T) => R, seed: R): Observable<R>;
  scan<R>(accumulator: any, seed?: any): Observable<any> {
    if (arguments.length > 1) {
      return scan(this._subscribe, accumulator, seed);
    } else {
      return scan1<T>(this._subscribe, accumulator);
    }
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
  subscribe(nextFn?: (x: T) => void, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription;
  subscribe(
    a: ((x: T) => void)| Observer<T> | undefined,
    errorFn?: (e: Error) => void,
    completeFn?: () => void): Subscription {
    return subscribe(this._subscribe, (typeof a === 'object') ? a : {
        next: a || ((): void => { /* nothing */ }),
        error: errorFn || ((): void => { /* nothing */ }),
        complete: completeFn || ((): void => { /* nothing */ })
    });
  }

}
