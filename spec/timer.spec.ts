import * as Rx from 'rxjs/Rx';
import * as ToyRx from '../src/Rx';

import { Log } from './helpers/log';

describe('Observable.timer with ms delay', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    let s: ToyRx.Subscription = ToyRx.Observable.timer(200, 100)
      .subscribe(tlog);
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    let s: Rx.Subscription = Rx.Observable.timer(200, 100)
      .subscribe(rlog);
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    expect(tlog.log.length).toBe(3);
    expect(tlog.log).toEqual(rlog.log);
  });

});

describe('Observable.timer with Date delay', () => {

  let tlog: Log<number>;
  let rlog: Log<number>;

  beforeEach((done: DoneFn) => {
    tlog = new Log(done);
    let delay: Date = new Date();
    delay.setMilliseconds(delay.getMilliseconds() + 200);
    let s: ToyRx.Subscription = ToyRx.Observable.timer(delay, 100)
      .subscribe(tlog);
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    rlog = new Log(done);
    let delay: Date = new Date();
    delay.setMilliseconds(delay.getMilliseconds() + 200);
    let s: Rx.Subscription = Rx.Observable.timer(delay, 100)
      .subscribe(rlog);
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    // console.log(tlog);
    expect(tlog.log.length).toBe(3);
    expect(tlog.log).toEqual(rlog.log);
  });

});
