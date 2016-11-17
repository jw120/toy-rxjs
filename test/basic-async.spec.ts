/* tslint:disable:typedef */ // typedefs are too unwieldy for delay/repeat/forever

import * as Rx from 'rxjs/Rx';
import * as ToyRx from '../src/toy-rxjs';

import { createAsyncLoggingObserver } from './logging-helper';

const delay = (ms: number) => (observer: Rx.Observer<string>): void => {
  observer.next('Start');
  setTimeout((): void => {
    observer.next('Trigger');
    observer.complete();
  }, ms);
};

const repeat = (ticks: number, ms: number) => (observer: Rx.Observer<string>): void => {
  let count: number = 0;
  observer.next('start');
  const id: any = setInterval((): void => {
    if (count < ticks) {
      count++;
      observer.next(`tick ${count}`);
    } else {
      clearInterval(id);
      observer.complete();
    }
  }, ms);
};

const forever = (ms: number) => (observer: Rx.Observer<string>): (() => void) => {
  let count: number = 0;
  observer.next('start');
  const id: any = setInterval((): void => {
      observer.next(`tick ${count}`);
  }, ms);
  return (): void => {
    clearInterval(id);
  };
};

describe('Observables from an async setTimeout', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    (new ToyRx.Observable<string>(delay(200)))
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
  });

  beforeEach((done: DoneFn) => {
    (new Rx.Observable<string>(delay(200)))
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
  });

  it('should work', () => {
    expect(tlog.length).toBe(3);
    expect(tlog).toEqual(rlog);
  });

});

describe('Observables from a finite async setInterval', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    (new ToyRx.Observable<string>(repeat(5, 100)))
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
  });

  beforeEach((done: DoneFn) => {
    (new Rx.Observable<string>(repeat(5, 100)))
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
  });

  it('should work', () => {
    expect(tlog.length).toBe(7);
    expect(tlog).toEqual(rlog);
  });

});

describe('Observables from an infinite async setInterval using unsubscribe', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    let s: ToyRx.Subscription = (new ToyRx.Observable<string>(forever(100)))
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    let s: Rx.Subscription = (new Rx.Observable<string>(forever(100)))
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    expect(tlog.length).toBe(5);
    expect(tlog).toEqual(rlog);
  });

});
