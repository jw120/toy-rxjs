import { Observable } from '../Observable';
import { Observer } from '../Observer';

// Create an observable that just completes
export function empty<T>(): Observable<T> {
  return new Observable((observer: Observer<T>): void => {
    observer.complete();
  });
}

// Create an observable that does nothing
export function never<T>(): Observable<T> {
  return new Observable((): void => { /* do nothing */ });
}

// Creates a synchronous observable from its arguments
export function of<T>(...args: T[]): Observable<T> {
  return new Observable((observer: Observer<T>): void => {
    args.forEach((x: T) => {
      observer.next(x);
    });
    observer.complete();
  });
}

// Creates an observable that just gives an error
export function staticThrow<T>(e: Error): Observable<T> {
  return new Observable((observer: Observer<T>): void => {
    observer.error(e);
  });
}
