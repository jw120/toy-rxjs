import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('Observable.never', () => {

  it('should do nothing', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.never()
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.never()
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual([]);
    expect(tlog).toEqual(rlog);
  });

});
