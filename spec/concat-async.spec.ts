import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('concat operator', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    ToyRx.Observable.interval(100).take(3)
      .concat(ToyRx.Observable.interval(50).take(2))
      .subscribe(tlog);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    Rx.Observable.interval(100).take(3)
      .concat(Rx.Observable.interval(50).take(2))
      .subscribe(rlog);
  });

  it('Should work with asynchronous observables', () => {
    expect(tlog.log).toEqual(['next 0', 'next 1', 'next 2', 'next 0', 'next 1', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
