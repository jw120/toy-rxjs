import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('Observable.range', () => {

  it('Should work on an array', () => {
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.range(3, 5)
      .subscribe(tlog);
    Rx.Observable.range(3, 5)
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 3', 'next 4', 'next 5', 'next 6', 'next 7', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
