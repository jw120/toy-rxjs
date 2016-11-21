import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { Log } from './helpers/log';

describe('concat operator', () => {

  it('Should work with regular synchronous observables', () => {
    const xs: number[] = [1, 2, 3];
    const ys: number[] = [4, 5];
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.of(...xs).concat(ToyRx.Observable.of(...ys))
      .subscribe(tlog);
    Rx.Observable.of(...xs).concat(Rx.Observable.of(...ys))
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 2', 'next 3', 'next 4', 'next 5', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('Should work with synchronous observables where streams continues after completion', () => {
    function f1(o: Rx.Observer<number>): void {
      o.next(1);
      o.next(2);
      o.complete();
      o.next(5);
    }
    function f2(o: Rx.Observer<number>): void {
      o.next(3);
      o.complete();
      o.next(4);
    }
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(f1)
     .concat(ToyRx.Observable.create(f2))
      .subscribe(tlog);
    Rx.Observable.create(f1)
     .concat(Rx.Observable.create(f2))
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 2', 'next 3', 'complete']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('Should work with synchronous observables where streams do not complete', () => {
    function f1(o: Rx.Observer<number>): void {
      o.next(7);
      o.next(8);
    }
    function f2(o: Rx.Observer<number>): void {
      o.next(9);
      o.next(10);
    }
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(f1)
     .concat(ToyRx.Observable.create(f2))
      .subscribe(tlog);
    Rx.Observable.create(f1)
     .concat(Rx.Observable.create(f2))
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 7', 'next 8']);
    expect(tlog.log).toEqual(rlog.log);
  });

  it('Should work with synchronous observables where first stream ends in an error', () => {
    function f1(o: Rx.Observer<number>): void {
      o.next(1);
      o.next(2);
      o.error(Error('fail!'));
      o.error(Error('extraneous fail'));
      o.complete();
      o.next(5);
    }
    function f2(o: Rx.Observer<number>): void {
      o.next(3);
      o.complete();
      o.next(4);
      o.error(Error('Cannot be reached'));
    }
    let tlog: Log<number> = new Log();
    let rlog: Log<number> = new Log();
    ToyRx.Observable.create(f1)
      .concat(ToyRx.Observable.create(f2))
      .subscribe(tlog);
    Rx.Observable.create(f1)
      .concat(Rx.Observable.create(f2))
      .subscribe(rlog);
    expect(tlog.log).toEqual(['next 1', 'next 2', 'error fail!']);
    expect(tlog.log).toEqual(rlog.log);
  });

});
