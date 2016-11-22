import { Observer } from './Observer';
import { Subscription } from './Subscription';
import { staticThrow } from './observable-static/throw';
import { timer } from './observable-static/timer';
import { empty, interval, of, range } from './observable-static/iterator';
import { never } from './observable-static/never';

import { concat } from './observable-operators/concat';
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

  // Static methods pulled in from observable-static

  static create<T>(createFn: SubscribeFn<T>): Observable<T> {
    return new Observable(createFn);
  }

  // If TypeScript allowed, type whould be:
  // static of(...args: T[], scheduler?: Scheduler )
  static of<T>(...args: any[]): Observable<T> {
    return of(...args);
  }

  static throw<T>(e: Error, scheduler?: Scheduler): Observable<T> {
    return staticThrow(e, scheduler);
  }

  static empty<T>(scheduler?: Scheduler): Observable<T> {
    return empty(scheduler);
  }

  static never<T>(): Observable<T> {
    return never();
  }

  static range(start: number, count: number, scheduler?: Scheduler): Observable<number> {
    return range(start, count, scheduler);
  }

  static interval(period: number, scheduler?: Scheduler): Observable<number> {
    return interval(period, scheduler);
  }

  static timer(delay: number | Date, period?: number): Observable<number> {
    return timer(delay, period);
  }

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
