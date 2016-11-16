import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('Observable.of', () => {

  it('Should work on an array', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.of(...xs)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.of(...xs)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 1', 'next 3', 'next 5', 'next 2', 'complete']);
    expect(tlog).toEqual(rlog);
  });


});
