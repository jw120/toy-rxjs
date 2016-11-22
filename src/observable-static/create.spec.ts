import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { Log } from '../test-helpers/log';
import { completeEmits, itObs } from '../test-helpers/compare';

describe('Observable.create (synchronous)', () => {

  function f1(observer: RefRx.Observer<number>): void {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
  }
  itObs('should work on a series of nexts',
    ToyRx.Observable.create(f1),
    RefRx.Observable.create(f1),
    completeEmits(1, 2, 3)
  );

  function f2(observer: RefRx.Observer<number>): void {
      observer.next(1);
      observer.error(Error('bad'));
      observer.next(3);
      observer.complete();
  }
  itObs('should work with an error',
    ToyRx.Observable.create(f2),
    RefRx.Observable.create(f2),
    ['next 1', 'error bad']
  );

  function f3(observer: RefRx.Observer<number>): void {
      observer.next(1);
      observer.complete();
      observer.error(Error('bad'));
      observer.next(3);
      observer.complete();
  }
  itObs('should work with a premature complete',
    ToyRx.Observable.create(f3),
    RefRx.Observable.create(f3),
    completeEmits(1)
  );

  it('should work with double subscriptions', () => {
    let tlog1: Log<number> = new Log();
    let rlog1: Log<number> = new Log();
    let tlog2: Log<number> = new Log();
    let rlog2: Log<number> = new Log();
    let tobs: ToyRx.Observable<number> = ToyRx.Observable.create(f1);
    tobs.subscribe(tlog1);
    tobs.subscribe(tlog2);
    let robs: RefRx.Observable<number> = RefRx.Observable.create(f1);
    robs.subscribe(rlog1);
    robs.subscribe(rlog2);
    expect(tlog1.log).toEqual(completeEmits(1, 2, 3));
    expect(tlog1.log).toEqual(tlog2.log);
    expect(tlog1.log).toEqual(rlog1.log);
    expect(tlog1.log).toEqual(rlog2.log);
  });

  it('should work with the function form of subscribe', () => {
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(f1).subscribe(
      (x: number) => tlog.next(x), (e: Error) => tlog.error(e), () => tlog.complete());
    RefRx.Observable.create(f1).subscribe(
      (x: number) => rlog.next(x), (e: Error) => rlog.error(e), () => rlog.complete());
    expect(tlog.log).toEqual(completeEmits(1, 2, 3));
    expect(tlog.log).toEqual(rlog.log);
  });

  it('should work with an error with the function form of subscribe', () => {
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(f2).subscribe(
      (x: number) => tlog.next(x), (e: Error) => tlog.error(e), () => tlog.complete());
    RefRx.Observable.create(f2).subscribe(
      (x: number) => rlog.next(x), (e: Error) => rlog.error(e), () => rlog.complete());
    expect(tlog.log).toEqual(['next 1', 'error bad']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
