import { Observable } from '../Observable';
import { Observer } from '../Observer';
import { isScheduler, Scheduler } from '../Scheduler';

 function fromArray<T>(xs: T[], scheduler?: Scheduler): Observable<T> {

  // Default is to create a synchronous observable
  if (scheduler !== Scheduler.async) {
    return new Observable((observer: Observer<T>): void => {
      xs.forEach((x: T): void => {
        observer.next(x);
      });
      observer.complete();
    });
  } else { // If called with Scheduler.async then we use node's setInerval to run asynchronously
    return new Observable((o: Observer<T>): (() => void) => {
      let i: number = 0;
      let id: number = setInterval(() => {
        if (i < xs.length) {
          o.next(xs[i++]);
        }
        if (i === xs.length) {
          clearInterval(id);
          id = null;
          o.complete();
        }
      }, 0);
      return () => { if (id) { clearInterval(id); } };
    });
  }

}

// Create an observable that just completes
export function empty<T>(scheduler?: Scheduler): Observable<T> {
  return fromArray<T>([], scheduler);
}

// Creates a synchronous observable from its arguments
export function of<T>(...args: T[]): Observable<T> {
  if (args.length > 0) {
    let possibleScheduler: T | Scheduler = args[args.length - 1];
    if (isScheduler(possibleScheduler)) {
      return fromArray(args.slice(0, -1), possibleScheduler);
    }
  }
  return fromArray(args, undefined);
}

// Creates an observable that just gives an error
export function staticThrow<T>(e: Error): Observable<T> {
  return new Observable((observer: Observer<T>): void => {
    observer.error(e);
  });
}

/**
 *
 * Never is a special, simple case
 *
 */

// Create an observable that does nothing
export function never<T>(): Observable<T> {
  return new Observable((): void => { /* do nothing */ });
}
