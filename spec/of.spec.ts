import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('Observable.of synchronous', () => {

  it('Should work on with no scheduler specified', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.of(...xs)
      .subscribe(tlog);
    Rx.Observable.of(...xs)
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('Should work with the synchronous scheduler specified', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.of(...xs, ToyRx.Scheduler.sync)
      .subscribe(tlog);
    Rx.Observable.of(...xs) // Rx does not have a sync scheduler
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});

describe('Observable.of asynchronous', () => {

  const xs: number[] = [1, 3, 5, 2];
  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log<number>(done);
    ToyRx.Observable.of(...xs, ToyRx.Scheduler.async)
      .subscribe(tlog);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    Rx.Observable.of<number>(...xs, Rx.Scheduler.async)
      .subscribe(rlog);
  });

  it('should work', () => {
    expect(tlog.log).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
