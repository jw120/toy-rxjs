/**
 *
 * Creating an Observable from an iterator (and related functions)
 *
 */

import { Observable } from '../Observable';
import { Observer } from '../Observer';
import { isScheduler, Scheduler } from '../Scheduler';

// Core function of this module
export function fromIterator<T>(iterator: Iterator<T>, period: number, scheduler: Scheduler): Observable<T> {

  // Default is to create a synchronous observable
  if (scheduler !== Scheduler.async) {
    return new Observable((o: Observer<T>): void => {
      let x: IteratorResult<T> = iterator.next();
      while (!x.done) {
        o.next(x.value);
        x = iterator.next();
      }
      o.complete();
    });
  } else { // If called with Scheduler.async then we use node's setInerval to run asynchronously
    return new Observable((o: Observer<T>): (() => void) => {
      let id: number = setInterval(() => {
        let x: IteratorResult<T> = iterator.next();
        if (x.done) {
          clearInterval(id);
          id = null;
          o.complete();
        } else {
          o.next(x.value);
        }
      }, period);
      return () => { if (id) { clearInterval(id); } };
    });
  }

}

// Simplly unwrap iterables
export function fromIterable<T>(iterable: Iterable<T>, period: number, scheduler: Scheduler): Observable<T> {
  return fromIterator(iterable[Symbol.iterator](), period, scheduler);
}

// Observable from arguments (last argument may be a Scheduler)
export function of<T>(...args: T[]): Observable<T> {
  if (args.length > 0) {
    let possibleScheduler: T | Scheduler = args[args.length - 1];
    if (isScheduler(possibleScheduler)) {
      return fromIterable(args.slice(0, -1), 0, possibleScheduler);
    }
  }
  return fromIterable(args, 0, undefined);
}

// Observable that just completes
export function empty<T>(scheduler?: Scheduler): Observable<T> {
  return fromIterable<T>([], 0, scheduler);
}

// Observable with count integers starting from start
export function range(start: number, count: number, scheduler?: Scheduler): Observable<number> {
  let i: number = 0;
  const iterator: Iterator<number> = {
    next: () => i < count ? { value: start + i++, done: false } : { value: undefined, done: true }
  };
  return fromIterator(iterator, 0, scheduler);
}

// Observable that emits sequential numbers starting from 0. Defaults to asynchronous Scheduler
export function interval(period: number, scheduler?: Scheduler): Observable<number> {
  scheduler = scheduler || Scheduler.async;
  let i: number = 0;
  const iterator: Iterator<number> = {
    next: () => ({ value: i++, done: false })
  };
  return fromIterator(iterator, period, scheduler);
}
