import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('map operator', () => {

  it('Should work with doubling', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: string[] = [];
    let rlog: string[] = [];
    const double: (x: number) => number = (x: number) => x * 2;
    ToyRx.Observable.of(...xs).map(double)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.of(...xs).map(double)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 2', 'next 6', 'next 10', 'next 4', 'complete']);
    expect(tlog).toEqual(rlog);
  });


});
