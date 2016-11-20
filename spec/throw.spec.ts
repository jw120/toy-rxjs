import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

const e: Error = Error('xyz');

describe('Observable.throw (synchronous)', () => {

 it('should work', () => {
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.throw(e)
      .subscribe(tlog);
    Rx.Observable.throw(e)
      .subscribe(rlog);
    expect(tlog.log).toEqual(['error xyz']);
    expect(tlog.log).toEqual(rlog.log);
  });

});

describe('Observable.throw (asynchronous)', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    ToyRx.Observable.throw(e, ToyRx.Scheduler.async)
      .subscribe(tlog);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    Rx.Observable.throw(e, Rx.Scheduler.async)
      .subscribe(rlog);
  });

  it('works', () => {
    expect(tlog.log).toEqual(['error xyz']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
