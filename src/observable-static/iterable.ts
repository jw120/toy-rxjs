/**
 *
 * Creating an Observable from an iterable (and related functions)
 *
 */

import { Observable } from '../Observable';
import { Observer } from '../Observer';
import { isScheduler, Scheduler } from '../Scheduler';

// fromIterable is a helper function which is not exported
function fromIterable<T>(iterable: Iterable<T>, scheduler?: Scheduler): Observable<T> {

  // Default is to create a synchronous observable
  if (scheduler !== Scheduler.async) {
    return new Observable((o: Observer<T>): void => {
      for (let x of iterable) {
        o.next(x);
      }
      o.complete();
    });
  } else { // If called with Scheduler.async then we use node's setInerval to run asynchronously
    let iterator: Iterator<T> = iterable[Symbol.iterator]();
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
      }, 0);
      return () => { if (id) { clearInterval(id); } };
    });
  }

}

// Creates a synchronous observable from its arguments
export function of<T>(...args: T[]): Observable<T> {
  if (args.length > 0) {
    let possibleScheduler: T | Scheduler = args[args.length - 1];
    if (isScheduler(possibleScheduler)) {
      return fromIterable(args.slice(0, -1), possibleScheduler);
    }
  }
  return fromIterable(args, undefined);
}

// Create an observable that just completes
export function empty<T>(scheduler?: Scheduler): Observable<T> {
  return fromIterable<T>([], scheduler);
}
