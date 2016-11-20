import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver, createLoggingObserverWithDone } from './logging-helper';

describe('Observable.of synchronous', () => {

  it('Should work on with no scheduler specified', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.of(...xs)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.of(...xs)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog).toEqual(rlog);
  });

  it('Should work with the synchronous scheduler specified', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.of(...xs, ToyRx.Scheduler.sync)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.of(...xs) // Rx does not have a sync scheduler
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});

describe('Observable.of asynchronous', () => {

  const xs: number[] = [1, 3, 5, 2];
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    ToyRx.Observable.of(...xs, ToyRx.Scheduler.async)
      .subscribe(createLoggingObserverWithDone(tlog, done));
  });

  beforeEach((done: DoneFn) => {
    Rx.Observable.of<number>(...xs, Rx.Scheduler.async)
      .subscribe(createLoggingObserverWithDone(rlog, done));
  });

  it('should work', () => {
    expect(tlog).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
