import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('Observable.throw', () => {

  it('should throw an error', () => {
    const e: Error = Error('xyz');
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.throw(e)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.throw(e)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['error xyz']);
    expect(tlog).toEqual(rlog);
  });

});
