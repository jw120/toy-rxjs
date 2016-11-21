/**
 *
 * Defines specialized helper functions to streamline jasmine tests
 *
 */

import * as ToyRx from '../../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './log';

/** Subscribe to given observables synchronously with logging observer and expect both to equal given value */
export function compare2Sync<T>(
  itMessage: string,
  toyObs: ToyRx.Observable<T>,
  refObs: Rx.Observable<T>,
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
  refObs: Rx.Observable<T>,
  expectedOutput: string[]
): void {
  let toyLog: Log<T>;
  let refLog: Log<T>;
  beforeEach((done: DoneFn) => {
    toyLog = new Log(done);
    toyObs.subscribe(toyLog);
  });
  beforeEach((done: DoneFn) => {
    refLog = new Log(done);
    refObs.subscribe(refLog);
  });
  it(itMessage, () => {
    expect(toyLog.log).toEqual(expectedOutput);
    expect(toyLog.log).toEqual(refLog.log);
  });
}
