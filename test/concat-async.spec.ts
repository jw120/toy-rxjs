import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserverWithDone } from './logging-helper';

describe('concat operator', () => {

  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    ToyRx.Observable.interval(100).take(3)
      .concat(ToyRx.Observable.interval(50).take(2))
      .subscribe(createLoggingObserverWithDone(tlog, done));
  });

  beforeEach((done: DoneFn) => {
    Rx.Observable.interval(100).take(3)
      .concat(Rx.Observable.interval(50).take(2))
      .subscribe(createLoggingObserverWithDone(rlog, done));
  });

  it('Should work with asynchronous observables', () => {
    expect(tlog).toEqual(['next 0', 'next 1', 'next 2', 'next 0', 'next 1', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
