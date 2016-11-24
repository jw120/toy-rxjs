/**
 *
 * Defines specialized versions of jasmine's describe and it functions to streamline tests
 *
 */

import * as ToyRx from '../../src/Rx';
import * as RefRx from 'rxjs/Rx';

import { Log } from './log';
import { TimedLog, mkTimedLog } from './timedLog';

/** Helper function to convert its arguments into an array of next's plus complete */
export function completeEmits(...xs: any[]): string[] {
  return incompleteEmits(...xs).concat('complete');
}

/** Helper function to convert its arguments into an array of next's */
export function incompleteEmits(...xs: any[]): string[] {
  return xs.map((x: any) => 'next ' + x.toString());
}

/** Subscribe to given observables synchronously with logging observer and expect both to equal given value */
export function itObs<T>(
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
    expect(refLog.log).toEqual(expectedOutput);
  });
}

/** Subscribe to given observables synchronously with logging observer and expect both to equal given value */
export function itObsHold<T>(
  itMessage: string,
  toyObsFn: () => ToyRx.Observable<T>,
  refObsFn: () => RefRx.Observable<T>,
  expectedOutput: string[]
): void {

  it(itMessage, () => {
    let toyLog: Log<T> = new Log();
    let refLog: Log<T> = new Log();
    toyObsFn().subscribe(toyLog);
    refObsFn().subscribe(refLog);
    expect(toyLog.log).toEqual(expectedOutput);
    expect(refLog.log).toEqual(expectedOutput);
  });
}

/** Subscribe to given observables asynchronously with logging observer and expect both to equal given value */
export function describeObsAsync<T>(
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

    it(`ToyRx logging (${itMessage})`, (done: DoneFn) => {
      toyLog = new Log(done);
      const toySub: ToyRx.Subscription = toyObs.subscribe(toyLog);
      if (timeout !== undefined) {
        setTimeout(() => { toySub.unsubscribe(); done(); }, timeout);
      }
    });

    it(`RefRx logging (${itMessage})`, (done: DoneFn) => {
      refLog = new Log(done);
      const refSub: RefRx.Subscription = refObs.subscribe(refLog);
      if (timeout !== undefined) {
        setTimeout(() => { refSub.unsubscribe(); done(); }, timeout);
      }
    });

    it(itMessage + ' (ToyRx)', () => {
      expect(toyLog.log).toEqual(expectedOutput);
    });

    it(itMessage + ' (RefRx)', () => {
      expect(refLog.log).toEqual(expectedOutput);
    });
  });
}

/** Subscribe to given observables asynchronously with timed logging observer and expect both to be close given value */
export function describeObsTimedAsync<T>(
  describeMessage: string,
  itMessage: string,
  toyObsFn: () => ToyRx.Observable<T>, // we pass a function to delay execution, so timing works better
  refObsFn: () => RefRx.Observable<T>,
  expectedTimes: number[],
  expectedValues: string[],
  timeout?: number
): void {

  describe(describeMessage, () => {

    let toyLog: TimedLog<T>;
    let refLog: TimedLog<T>;
    let expLog: TimedLog<T> = mkTimedLog(expectedTimes, expectedValues);

    it(`ToyRx logging (${itMessage})`, (done: DoneFn) => {
      toyLog = new TimedLog(done);
      const toySub: ToyRx.Subscription = toyObsFn().subscribe(toyLog);
      if (timeout !== undefined) {
        setTimeout(() => { toySub.unsubscribe(); done(); }, timeout);
      }
    });

    it(itMessage + ' (ToyRx)', () => {
      expect(toyLog).toEqual(expLog);
    });

    it(`RefRx logging (${itMessage})`, (done: DoneFn) => {
      refLog = new TimedLog(done);
      const refSub: RefRx.Subscription = refObsFn().subscribe(refLog);
      if (timeout !== undefined) {
        setTimeout(() => { refSub.unsubscribe(); done(); }, timeout);
      }
    });

    it(itMessage + ' (RefRx)', () => {
      expect(refLog).toEqual(expLog);
    });

  });
}
