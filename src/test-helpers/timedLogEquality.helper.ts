/**
 *
 * When included as a jasmine helper file, adds an equality function for
 * timedLog's that allows a margin of error in timings
 *
 */

import { TimedLog, TimedLogEntry } from './timedLog';

/** Tolerance allowed for timings across our tests (milliseconds) */
const specTolerance: [number, number] = [-50, 50];

beforeEach(() => {
  jasmine.addCustomEqualityTester(timedLogEquality);
});

/** Custom equality function on timedLogfor jasmine */
export function timedLogEquality<T>(first: TimedLog<T>, second: TimedLog<T>): boolean {

  // Don't use this equality tester on objects which are not TimedLogs
  if (!(first instanceof TimedLog) || !(second instanceof TimedLog)) {
    return undefined;
  }

  if (first._log.length !== second._log.length) {
    return false;
  }

  // Async logs might legitimately be in a different order, we sort by the value before comparing
  function compareValue(a: TimedLogEntry, b: TimedLogEntry): number { return a.value.localeCompare(b.value); }
  const firstLogSorted: Array<TimedLogEntry> = first._log.concat().sort(compareValue);
  const secondLogSorted: Array<TimedLogEntry> = second._log.concat().sort(compareValue);

  return firstLogSorted.every((firstEntry: TimedLogEntry, i: number): boolean => {
      const secondEntry: TimedLogEntry = secondLogSorted[i];
      return firstEntry.time > secondEntry.time + specTolerance[0] &&
        firstEntry.time < secondEntry.time + specTolerance[1] &&
        firstEntry.value === secondEntry.value;
    });

}
