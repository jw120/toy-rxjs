import { Observable, SubscribeFn } from '../Observable';
import { subscribe } from '../observable-operators/subscribe';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';
import { TearDownLogic } from '../utils/TearDownLogic';

export function combineLatest<T, U>(first: SubscribeFn<T>, second: SubscribeFn<U>): Observable<[T, U]> {

  return new Observable<[T, U]>((o: Observer<[T, U]>): TearDownLogic => {

    let latest: [T, U] = [undefined, undefined];
    let started: [boolean, boolean] = [false, false];
    let completed: [boolean, boolean] = [false, false];

    // If both observables have started, emit the pair
    function emit(): void {
      if (started[0] && started[1]) {
        o.next(latest);
      }
    }

    // If both observable have completed, then complete
    function complete(): void {
      if (completed[0] && completed[1]) {
        o.complete();
      }
    }

    const firstObserver: Observer<T> = {
      next: (x: T) => { started[0] = true; latest[0] = x; console.log('1st', x, latest); emit(); },
      error: (e: Error) => o.error(e),
      complete: () => { console.log('1st complete', latest); completed[0] = true; complete(); }
    };

    const secondObserver: Observer<U> = {
      next: (x: U) => { started[1] = true; latest[1] = x; console.log('2nd', x, latest); emit(); },
      error: (e: Error) => o.error(e),
      complete: () => { console.log('2nd complete', latest); completed[1] = true; complete(); }
    };

    const firstSub: Subscription = subscribe(first, firstObserver);
    const secondSub: Subscription = subscribe(second, secondObserver);

  });

}
