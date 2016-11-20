import * as Rx from 'rxjs/Rx';
import * as ToyRx from '../src/Rx';

import { createAsyncLoggingObserver } from './logging-helper';

describe('Observable.timer with ms delay', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    let s: ToyRx.Subscription = ToyRx.Observable.timer(200, 100)
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    let s: Rx.Subscription = Rx.Observable.timer(200, 100)
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    expect(tlog.length).toBe(3);
    expect(tlog).toEqual(rlog);
  });

});

describe('Observable.timer with Date delay', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    let delay: Date = new Date();
    delay.setMilliseconds(delay.getMilliseconds() + 200);
    let s: ToyRx.Subscription = ToyRx.Observable.timer(delay, 100)
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    let delay: Date = new Date();
    delay.setMilliseconds(delay.getMilliseconds() + 200);
    let s: Rx.Subscription = Rx.Observable.timer(delay, 100)
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    // console.log(tlog);
    expect(tlog.length).toBe(3);
    expect(tlog).toEqual(rlog);
  });

});
