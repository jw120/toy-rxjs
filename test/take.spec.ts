import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('take operator', () => {

  it('Should work to shorten a list', () => {
    const xs: number[] = [1, 3, 5, 2, 4, 9];
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.of(...xs).take(3)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.of(...xs).take(3)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 1', 'next 3', 'next 5', 'complete']);
    expect(tlog).toEqual(rlog);
  });

  it('Should ignore a short list', () => {
    const xs: number[] = [1, 3];
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.of(...xs).take(3)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.of(...xs).take(3)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 1', 'next 3', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
