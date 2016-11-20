import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

describe('Observable.create', () => {

  it('Should work on a series of nexts', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: ToyRx.Observer<number>): void => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    };
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.create(c)
      .subscribe(createLoggingObserver(tlog));
    Rx.Observable.create(c)
      .subscribe(createLoggingObserver(rlog));
    expect(tlog).toEqual(['next 1', 'next 2', 'next 3', 'complete']);
    expect(tlog).toEqual(rlog);
  });

});
