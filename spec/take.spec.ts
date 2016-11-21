import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('take operator', () => {

  it('Should work to shorten a list', () => {
    const xs: number[] = [1, 3, 5, 2, 4, 9];
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.of(...xs).take(3)
      .subscribe(tlog);
    Rx.Observable.of(...xs).take(3)
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 3', 'next 5', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('Should ignore a short list', () => {
    const xs: number[] = [1, 3];
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.of(...xs).take(3)
      .subscribe(tlog);
    Rx.Observable.of(...xs).take(3)
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 3', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
