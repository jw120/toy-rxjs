import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('Observable.interval().take() operator', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    ToyRx.Observable.interval(100).take(3)
      .subscribe(tlog);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    Rx.Observable.interval(100).take(3)
      .subscribe(rlog);
  });

  it('should work', () => {
    expect(tlog.log).toEqual(['next 0', 'next 1', 'next 2', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
