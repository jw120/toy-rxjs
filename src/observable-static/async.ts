import { Observable } from '../Observable';
import { Observer } from '../Observer';

export function interval(period: number): Observable<number> {
  return new Observable((observer: Observer<number>):  (() => void) => {
    let i: number = 0;
    const id: any = setInterval(() => {
      observer.next(i++);
    }, period);
    return (): void => clearInterval(id);
  });
}

export function timer(delayMsOrDate: number | Date, period: number): Observable<number> {
  let delay: number; // in milliseconds
  if (typeof delayMsOrDate === 'number') {
    delay = delayMsOrDate;
  } else {
    delay = delayMsOrDate.getTime() - Date.now();
  }
  return new Observable((observer: Observer<number>):  (() => void) => {
    let id: any = setTimeout(() => {
        let i: number = 0;
        observer.next(i++);
        id = setInterval(() => {
          observer.next(i++);
        }, period);
    }, delay);
    return (): void => clearInterval(id);
  });
}
