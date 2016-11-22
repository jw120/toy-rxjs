/**
 *
 * When included as a jasmine helper file, adds an equality function for
 * timedLog's that allows a margin of error in timings
 *
 */

import { TimedLog, TimedLogEntry } from './log';

/** Tolerance allowed for timings across our tests (milliseconds) */
const specTolerance: [number, number] = [-10, 50];

beforeEach(() => {
  jasmine.addCustomEqualityTester(timedLogEquality);
});

/** Custom equality function on timedLogfor jasmine */
export function timedLogEquality<T>(first: TimedLog<T>, second: TimedLog<T>): boolean {

  // Don't use this equality tester on objects which are not TimedLogs
  if (!(first instanceof TimedLog) || !(second instanceof TimedLog)) {
    return undefined;
  }

  return first._log.length === second._log.length &&
    first._log.every((firstEntry: TimedLogEntry, i: number): boolean => {
      const secondEntry: TimedLogEntry = second._log[i];
      return firstEntry.time > secondEntry.time + specTolerance[0] &&
        firstEntry.time < secondEntry.time + specTolerance[1] &&
        firstEntry.value === secondEntry.value;
    });

}
