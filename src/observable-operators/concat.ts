import { Observable, SubscribeFn } from '../Observable';
import { Observer } from '../Observer';

import { subscribe } from './subscribe';
import { TearDownLogic } from '../utils/TearDownLogic';

/** Returns an observable whose values are those of the first observable followed by the second */
export function concat<T>(first: SubscribeFn<T>, second: SubscribeFn<T>): Observable<T> {

  return new Observable<T>((o: Observer<T>): TearDownLogic => {

    subscribe(first, o, () => { subscribe(second, o); });

  });

}
