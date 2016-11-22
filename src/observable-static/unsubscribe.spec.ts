import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { Log } from '../test-helpers/log';

describe('unsubscribe', () => {

  function f1(observer: RefRx.Observer<number>): void {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
  }
  it('should work with no return value', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription = ToyRx.Observable.create(f1)
      .subscribe(toyLog);
    let refSub: RefRx.Subscription = RefRx.Observable.create(f1)
      .subscribe(refLog);
    expect(toyLog.log).toEqual(['next 1', 'next 2', 'next 3', 'complete']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

  function f2(log: Log<number>): (obs: RefRx.Observer<number>) => (() => void) {
    return (observer: RefRx.Observer<number>) => {
      observer.next(0);
      observer.complete();
      return () => { log.add('unsub'); };
    };
  }
  it('should work with a function return value, triggering on complete', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription = ToyRx.Observable.create(f2(toyLog))
      .subscribe(toyLog);
    let refSub: RefRx.Subscription = RefRx.Observable.create(f2(refLog))
      .subscribe(refLog);
    expect(toyLog.log).toEqual(['next 0', 'complete', 'unsub']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

  function f3(log: Log<number>): (obs: RefRx.Observer<number>) => (() => void) {
    return (observer: RefRx.Observer<number>) => {
      observer.next(7);
      observer.error(Error('QQ'));
      return () => { log.add('unsub'); };
    };
  }
  it('should work with a function return value, triggering on error', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription = ToyRx.Observable.create(f3(toyLog))
      .subscribe(toyLog);
    let refSub: RefRx.Subscription = RefRx.Observable.create(f3(refLog))
      .subscribe(refLog);
    expect(toyLog.log).toEqual(['next 7', 'error QQ', 'unsub']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

  function f4(log: Log<number>): (obs: RefRx.Observer<number>) => (() => void) {
    return (observer: RefRx.Observer<number>) => {
      observer.next(2);
      return () => { log.add('unsub'); };
    };
  }
  it('should work with a function return value, triggering with explicit unsubscribe', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription = ToyRx.Observable.create(f4(toyLog))
      .subscribe(toyLog);
    let refSub: RefRx.Subscription = RefRx.Observable.create(f4(refLog))
      .subscribe(refLog);

    // Before unsubscribe
    expect(toyLog.log).toEqual(['next 2']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(false);
    expect(refSub.closed).toBe(false);

    toySub.unsubscribe();
    refSub.unsubscribe();

    // After unsubscribe
    expect(toyLog.log).toEqual(['next 2', 'unsub']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

  function f5(log: Log<number>): (obs: RefRx.Observer<number>) => (() => void) {
    return (observer: RefRx.Observer<number>) => {
      observer.next(4);
      observer.complete();
      return () => { log.add('unsub'); };
    };
  }
  it('Should work with a function return value, triggering once with both complete and explicit unsubscribe', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription = ToyRx.Observable.create(f5(toyLog))
      .subscribe(toyLog);
    let refSub: RefRx.Subscription = RefRx.Observable.create(f5(refLog))
      .subscribe(refLog);

    // Before unsubscribe
    expect(toyLog.log).toEqual(['next 4', 'complete', 'unsub']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);

    toySub.unsubscribe();
    refSub.unsubscribe();

    // After unsubscribe
    expect(toyLog.log).toEqual(['next 4', 'complete', 'unsub']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

  function f6(log: Log<number>): (obs: RefRx.Observer<number>) => { unsubscribe: () => void } {
    return (observer: RefRx.Observer<number>) => {
      observer.next(3);
      observer.complete();
      return { unsubscribe: () => { log.add('unsub'); } };
    };
  }
  it('should work with a function return value, triggering on complete', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription = ToyRx.Observable.create(f6(toyLog))
      .subscribe(toyLog);
    let refSub: RefRx.Subscription = RefRx.Observable.create(f6(refLog))
      .subscribe(refLog);
    expect(toyLog.log).toEqual(['next 3', 'complete', 'unsub']);
    expect(toyLog.log).toEqual(refLog.log);
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

});
