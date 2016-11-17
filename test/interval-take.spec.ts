import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserverWithDone } from './logging-helper';

describe('Observable.interval().take() operator', () => {

  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    ToyRx.Observable.interval(100).take(3)
      .subscribe(createLoggingObserverWithDone(tlog, done));
  });

  beforeEach((done: DoneFn) => {
    Rx.Observable.interval(100).take(3)
      .subscribe(createLoggingObserverWithDone(rlog, done));
  });

  it('should work', () => {
    expect(tlog).toEqual(['next 0', 'next 1', 'next 2', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
