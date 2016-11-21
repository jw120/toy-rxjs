/**
 *
 * Defines static functional version of Observable.never
 *
 */

import { Observable } from '../Observable';
import { Observer } from '../Observer';

export function timer(delayMsOrDate: number | Date, period: number): Observable<number> {
  let delay: number; // in milliseconds
  if (typeof delayMsOrDate === 'number') {
    delay = delayMsOrDate;
  } else {
    delay = delayMsOrDate.getTime() - Date.now();
  }
  return new Observable((observer: Observer<number>):  (() => void) => {
    let id: number = setTimeout(() => {
        let i: number = 0;
        observer.next(i++);
        id = setInterval(() => {
          observer.next(i++);
        }, period);
    }, delay);
    return (): void => clearTimeout(id);
  });
}
