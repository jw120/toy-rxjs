import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('Observable.range', () => {

  it('Should work on an array', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.range(3, 5)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.range(3, 5)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 3', 'next 4', 'next 5', 'next 6', 'next 7', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
