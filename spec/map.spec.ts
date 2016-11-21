import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('map operator', () => {

  it('Should work with doubling', () => {
    const xs: number[] = [1, 3, 5, 2];
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    const double: (x: number) => number = (x: number) => x * 2;
    ToyRx.Observable.of(...xs).map(double)
      .subscribe(tlog);
    Rx.Observable.of(...xs).map(double)
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 2', 'next 6', 'next 10', 'next 4', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
