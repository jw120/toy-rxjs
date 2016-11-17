import * as Rx from 'rxjs/Rx';
import * as ToyRx from '../src/toy-rxjs';

import { createAsyncLoggingObserver } from './logging-helper';

describe('Observable.interval', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    let s: ToyRx.Subscription = ToyRx.Observable.interval(100)
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    let s: Rx.Subscription = Rx.Observable.interval(100)
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    expect(tlog.length).toBe(4);
    expect(tlog).toEqual(rlog);
  });

});
