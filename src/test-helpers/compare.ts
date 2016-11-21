/**
 *
 * Defines specialized versions of jasmine's describe and it functions to streamline tests
 *
 */

import * as ToyRx from '../../src/Rx';
import * as RefRx from 'rxjs/Rx';

import { Log, TimedLog } from './log';

/** Subscribe to given observables synchronously with logging observer and expect both to equal given value */
export function it2Sync<T>(
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
export function describe2Async<T>(
  describeMessage: string,
  itMessage: string,
  toyObs: ToyRx.Observable<T>,
  refObs: RefRx.Observable<T>,
  expectedOutput: string[],
  timeout?: number
): void {
  describe(describeMessage, () => {
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
  });
}

/** Subscribe to given observables asynchronously with timed logging observer and expect both to be close given value */
export function describe2AsyncClose<T>(
  describeMessage: string,
  itMessage: string,
  toyObs: ToyRx.Observable<T>,
  refObs: RefRx.Observable<T>,
  expectedTimes: number[],
  expectedValues: string[],
  tolerance: [number, number],
  timeout?: number
): void {
  describe(describeMessage, () => {
    let toyLog: TimedLog<T>;
    let refLog: TimedLog<T>;
    beforeEach((done: DoneFn) => {
      toyLog = new TimedLog(done);
      const toySub: ToyRx.Subscription = toyObs.subscribe(toyLog);
      if (timeout !== undefined) {
        setTimeout(() => { toySub.unsubscribe(); done(); }, timeout);
      }
    });
    beforeEach((done: DoneFn) => {
      refLog = new TimedLog(done);
      const refSub: RefRx.Subscription = refObs.subscribe(refLog);
      if (timeout !== undefined) {
        setTimeout(() => { refSub.unsubscribe(); done(); }, timeout);
      }
    });
    it(itMessage, () => {
      expect(toyLog.isCloseTo(expectedTimes, expectedValues, tolerance)).toBe(true);
      expect(refLog.isCloseTo(expectedTimes, expectedValues, tolerance)).toBe(true);
    });
  });
}
