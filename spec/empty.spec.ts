import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('Observable.empty', () => {

  it('should work', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.empty()
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.empty()
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['complete']);
    expect(tlog).toEqual(rlog);
  });

});
