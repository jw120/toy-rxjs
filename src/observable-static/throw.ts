/**
 *
 * Creating an Observable that just passed an error (named staticThrow to avoid clash
 * with JavaScript keyword)
 *
 */

import { Observable } from '../Observable';
import { Observer } from '../Observer';
import { Scheduler } from '../Scheduler';

export function staticThrow<T>(e: Error, scheduler?: Scheduler): Observable<T> {

  // Default is to create a synchronous observable
  if (scheduler !== Scheduler.async) {

    return new Observable((observer: Observer<T>): void => {
        observer.error(e);
    });

  } else { // If called with Scheduler.async then we use node's setInterval to run asynchronously

    return new Observable((o: Observer<T>): (() => void) => {
      let id: number = setInterval(() => {
        clearInterval(id);
        id = null;
        o.error(e);
      }, 0);
      return () => { if (id) { clearInterval(id); } };
    });

  }

}
