import * as Rx from 'rxjs/Rx';
import * as ToyRx from '../src/Rx';

import { Log } from './helpers/log';

describe('Observable.interval', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    let s: ToyRx.Subscription = ToyRx.Observable.interval(100)
      .subscribe(tlog);
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    let s: Rx.Subscription = Rx.Observable.interval(100)
      .subscribe(rlog);
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    expect(tlog.log.length).toBe(4);
    expect(tlog.log).toEqual(rlog.log);
  });

});
