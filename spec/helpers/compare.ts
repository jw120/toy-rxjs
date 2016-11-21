import * as ToyRx from '../../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './log';

// Use logging observers on a toy observer and reference observable
// Expect toy's log to be the expected value and to match the reference
export function toyRefExp<T>(
  toyObs: ToyRx.Observable<T>,
  refObs: Rx.Observable<T>,
  expectedOutput: string[]
) {
  let toyLog: Log<T> = new Log();
  let refLog: Log<T> = new Log();
  toyObs.subscribe(toyLog);
  refObs.subscribe(refLog);
  expect(toyLog.log).toEqual(expectedOutput);
  expect(toyLog.log).toEqual(refLog.log);
}