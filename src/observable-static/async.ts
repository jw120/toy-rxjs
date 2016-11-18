import { Observable } from '../Observable';
import { Observer } from '../Observer';

// Create an observable that just completes
export function interval(period: number): Observable<number> {
  return new Observable((observer: Observer<number>):  (() => void) => {
    let i: number = 0;
    const id: any = setInterval(() => {
      observer.next(i++);
    }, period);
    return (): void => clearInterval(id);
  });
}
