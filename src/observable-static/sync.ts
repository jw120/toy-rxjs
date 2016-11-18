import { Observable } from '../Observable';
import { Observer } from '../Observer';

export function range(start: number, count: number): Observable<number> {
  return new Observable((observer: Observer<number>): void => {
    for (let i: number = start; i < start + count; i++) {
      observer.next(i);
    }
    observer.complete();
  });
}
