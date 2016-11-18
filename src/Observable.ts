import { Observer } from './Observer';
import { Subscription, TearDownLogic } from './Subscription';

import { interval } from './observable-static/async';
import { empty, never, of, staticThrow } from './observable-static/simple';
import { range } from './observable-static/sync';

import { concat } from './observable-operators/concat';
import { map } from './observable-operators/map';
import { take } from './observable-operators/take';

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

  // operators pulled in from observable-operators (where they are defined as functions on SubscribeFns)
  map<U>(project: (x: T) => U): Observable<U> { return map(this._subscribe, project); }
  concat(o: Observable<T>): Observable<T> { return concat(this._subscribe, o._subscribe); }
  take(n: number): Observable<T> { return take(this._subscribe, n); }

  // Subscribe method
  subscribe(o: Observer<T>): Subscription;
  subscribe(nextFn: (x: T) => void, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription;
  subscribe(a: ((x: T) => void)| Observer<T>, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription {

    // We start with our raw observer - either supplied as an argument or built with given functions
    let rawObserver: Observer<T> = (typeof a === 'object') ? a : {
        next: a,
        error: errorFn || ((): void => { /* nothing */ }),
        complete: completeFn || ((): void => { /* nothing */ })
    };

    // We wrap the observer so that we stop passing values after a complete or error
    let finished: boolean = false;
    const unsub: TearDownLogic = this._subscribe({
      next: (x: T): void => { if (!finished) { rawObserver.next(x); } },
      error: (e: Error): void => { if (!finished) { finished = true; rawObserver.error(e); } },
      complete: (): void => { if (!finished) { finished = true; rawObserver.complete(); } }
    });

    // We return the unsubscription method from the createFn as a Subscriber
    if (typeof unsub === 'function') {
      return new Subscription(unsub);
    } else if (typeof unsub === 'object') {
      return new Subscription((unsub as any).unsubscribe);
    } else {
      return new Subscription(undefined);
    }

  }

}
