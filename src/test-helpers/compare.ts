/**
 *
 * Defines specialized helper functions to streamline jasmine tests
 *
 */

import * as ToyRx from '../../src/Rx';
import * as RefRx from 'rxjs/Rx';

import { Log } from './log';

/** Subscribe to given observables synchronously with logging observer and expect both to equal given value */
export function compare2Sync<T>(
  itMessage: string,
  toyObs: ToyRx.Observable<T>,
  refObs: RefRx.Observable<T>,
  expectedOutput: string[]
): void {
  it(itMessage, () => {
    let toyLog: Log<T> = new Log();
    let refLog: Log<T> = new Log();
    toyObs.subscribe(toyLog);
    refObs.subscribe(refLog);
    expect(toyLog.log).toEqual(expectedOutput);
    expect(toyLog.log).toEqual(refLog.log);
  });
}

/** Subscribe to given observables asynchronously with logging observer and expect both to equal given value */
export function compare2Async<T>(
  itMessage: string,
  toyObs: ToyRx.Observable<T>,
  refObs: RefRx.Observable<T>,
  expectedOutput: string[],
  timeout?: number
): void {
  let toyLog: Log<T>;
  let refLog: Log<T>;
  beforeEach((done: DoneFn) => {
    toyLog = new Log(done);
    const toySub: ToyRx.Subscription = toyObs.subscribe(toyLog);
    if (timeout !== undefined) {
      setTimeout(() => { toySub.unsubscribe(); done(); }, timeout);
    }
  });
  beforeEach((done: DoneFn) => {
    refLog = new Log(done);
    const refSub: RefRx.Subscription = refObs.subscribe(refLog);
    if (timeout !== undefined) {
      setTimeout(() => { refSub.unsubscribe(); done(); }, timeout);
    }
  });
  it(itMessage, () => {
    expect(toyLog.log).toEqual(expectedOutput);
    expect(toyLog.log).toEqual(refLog.log);
  });
}
