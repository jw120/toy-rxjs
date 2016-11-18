import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserverWithDone } from './logging-helper';

describe('concat operator', () => {

  let tlog1: string[] = [];
  let tlog2: string[] = [];

  beforeEach((done: DoneFn) => {
    ToyRx.Observable.interval(100).take(3)
      .subscribe(createLoggingObserverWithDone(tlog1, done));
  });

  beforeEach((done: DoneFn) => {
    ToyRx.Observable.interval(50).take(2)
      .subscribe(createLoggingObserverWithDone(tlog2, done));
  });

  let rlog1: string[] = [];
  let rlog2: string[] = [];

  beforeEach((done: DoneFn) => {
    Rx.Observable.interval(100).take(3)
      .subscribe(createLoggingObserverWithDone(rlog1, done));
  });

  beforeEach((done: DoneFn) => {
    Rx.Observable.interval(50).take(2)
      .subscribe(createLoggingObserverWithDone(rlog2, done));
  });

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
    expect(tlog1).toEqual(['next 0', 'next 1', 'next 2', 'complete']);
    expect(tlog2).toEqual(['next 0', 'next 1', 'complete']);
    expect(rlog1).toEqual(['next 0', 'next 1', 'next 2', 'complete']);
    expect(rlog2).toEqual(['next 0', 'next 1', 'complete']);
    expect(tlog).toEqual(['next 0', 'next 1', 'next 2', 'next 0', 'next 1', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
