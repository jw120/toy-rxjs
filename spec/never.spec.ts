import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('Observable.never', () => {

  it('should do nothing', () => {
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.never()
      .subscribe(tlog);
    Rx.Observable.never()
      .subscribe(rlog);
    expect(tlog.log).toEqual([]);
    expect(tlog.log).toEqual(rlog.log);
  });

});
