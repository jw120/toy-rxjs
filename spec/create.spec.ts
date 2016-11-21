import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('Observable.create (synchronous)', () => {

  it('should work on a series of nexts', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: Rx.Observer<number>): void => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    };
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(c).subscribe(tlog);
    Rx.Observable.create(c).subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 2', 'next 3', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('should work with an error', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: Rx.Observer<number>): void => {
      observer.next(1);
      observer.error(Error('bad'));
      observer.next(3);
      observer.complete();
    };
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(c).subscribe(tlog);
    Rx.Observable.create(c).subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'error bad']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('Should work with a premature complete', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: Rx.Observer<number>): void => {
      observer.next(1);
      observer.complete();
      observer.error(Error('bad'));
      observer.next(3);
      observer.complete();
    };
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(c).subscribe(tlog);
    Rx.Observable.create(c).subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('should work with double subscriptions', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: Rx.Observer<number>): void => {
      observer.next(1);
      observer.next(2);
      observer.complete();
    };
    let tlog1: Log<number> = new Log();
    let rlog1: Log<number> = new Log();
    let tlog2: Log<number> = new Log();
    let rlog2: Log<number> = new Log();
    let tobs: ToyRx.Observable<number> = ToyRx.Observable.create(c);
    tobs.subscribe(tlog1);
    tobs.subscribe(tlog2);
    let robs: Rx.Observable<number> = Rx.Observable.create(c);
    robs.subscribe(rlog1);
    robs.subscribe(rlog2);
    expect(tlog1.log).toEqual(['next 1', 'next 2', 'complete']);
    expect(tlog1.log).toEqual(tlog2.log);
    expect(tlog1.log).toEqual(rlog1.log);
    expect(tlog1.log).toEqual(rlog2.log);
  });

  it('should work with the function form of subscribe', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: Rx.Observer<number>): void => {
      observer.next(1);
      observer.next(2);
      observer.complete();
    };
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(c).subscribe(
      (x: number) => tlog.next(x), (e: Error) => tlog.error(e), () => tlog.complete());
    Rx.Observable.create(c).subscribe(
      (x: number) => rlog.next(x), (e: Error) => rlog.error(e), () => rlog.complete());
    expect(tlog.log).toEqual(['next 1', 'next 2', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('should work with an error with the function form of subscribe', () => {
    let c: (o: Rx.Observer<number>) => void = (observer: Rx.Observer<number>): void => {
      observer.next(1);
      observer.error(Error('QQ'));
      observer.next(2);
      observer.complete();
    };
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(c).subscribe(
      (x: number) => tlog.next(x), (e: Error) => tlog.error(e), () => tlog.complete());
    Rx.Observable.create(c).subscribe(
      (x: number) => rlog.next(x), (e: Error) => rlog.error(e), () => rlog.complete());
    expect(tlog.log).toEqual(['next 1', 'error QQ']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
