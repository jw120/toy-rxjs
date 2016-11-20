import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('Observable.empty (synchronous)', () => {

  it('should work', () => {
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.empty()
      .subscribe(tlog);
    Rx.Observable.empty()
      .subscribe(rlog);
    expect(tlog.log).toEqual(['complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});

describe('Observable.empty (asynchronous)', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    ToyRx.Observable.empty(ToyRx.Scheduler.async)
      .subscribe(tlog);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    Rx.Observable.empty(Rx.Scheduler.async)
      .subscribe(rlog);
  });

  it('works', () => {
    expect(tlog.log).toEqual(['complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
