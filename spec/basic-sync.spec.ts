import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

import { createLoggingObserver } from './logging-helper';

// create two observables (from rxjs and the toy library) from the given creation function
export function runTwo<T>(c: (o: Rx.Observer<T>) => void): [string[], string[]] {
  const t: ToyRx.Observable<T> = new ToyRx.Observable<T>(c);
  const r: Rx.Observable<T> = new Rx.Observable<T>(c);
  let tlog: string[] = [];
  let rlog: string[] = [];
  t.subscribe(createLoggingObserver(tlog));
  r.subscribe(createLoggingObserver(rlog));
  return [tlog, rlog];
}

// create two observables (from rxjs and the toy library) from the given creation function
// and run with two subscribers
export function runTwoDouble<T>(c: (o: Rx.Observer<T>) => void): [string[], string[]] {
  const t: ToyRx.Observable<T> = new ToyRx.Observable<T>(c);
  const r: Rx.Observable<T> = new Rx.Observable<T>(c);
  let tlog: string[] = [];
  let rlog: string[] = [];
  t.subscribe(createLoggingObserver(tlog, 'A'));
  t.subscribe(createLoggingObserver(tlog, 'B'));
  r.subscribe(createLoggingObserver(rlog, 'A'));
  r.subscribe(createLoggingObserver(rlog, 'B'));
  return [tlog, rlog];
}

// create two observables (from rxjs and the toy library) from the given creation function
// and use the functional form of subscribe
export function runTwoFn<T>(c: (o: Rx.Observer<T>) => void): [string[], string[]] {
  const t: ToyRx.Observable<T> = new ToyRx.Observable<T>(c);
  const r: Rx.Observable<T> = new Rx.Observable<T>(c);
  let tlog: string[] = [];
  let rlog: string[] = [];
  t.subscribe(
      (x: T) => tlog.push('next ' + x),
      (e: Error) => tlog.push('error', e.message),
      () => tlog.push('complete')
  );
  r.subscribe(
      (x: T) => rlog.push('next ' + x),
      (e: Error) => rlog.push('error', e.message),
      () => rlog.push('complete')
  );
  return [rlog, rlog];
}

describe('Observables from a simple creation function', () => {

  it('Should work on a series of nexts', () => {
    let [t, r]: [string[], string[]] = runTwo<number>((observer: Rx.Observer<number>) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

  it('Should work with an error', () => {
    let [t, r]: [string[], string[]] = runTwo<number>((observer: Rx.Observer<number>) => {
      observer.next(1);
      observer.error(new Error('bad'));
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

  it('Should work with a premature complete', () => {
    let [t, r]: [string[], string[]] = runTwo<number>((observer: Rx.Observer<number>) => {
      observer.complete();
      observer.error(new Error('bad'));
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

  it('Should work with double subscriptions', () => {
    let [t, r]: [string[], string[]] = runTwoDouble<number>((observer: Rx.Observer<number>) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

  it('Should work on a series of nexts with the function form of subscribe', () => {
    let [t, r]: [string[], string[]] = runTwoFn<number>((observer: Rx.Observer<number>) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

  it('Should work with an error with the function form of subscribe', () => {
    let [t, r]: [string[], string[]] = runTwoFn<number>((observer: Rx.Observer<number>) => {
      observer.next(1);
      observer.error(new Error('bad'));
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

  it('Should work with a premature complete  with the function form of subscribe', () => {
    let [t, r]: [string[], string[]] = runTwoFn<number>((observer: Rx.Observer<number>) => {
      observer.complete();
      observer.error(new Error('bad'));
      observer.next(3);
      observer.complete();
    });
    expect(t).toEqual(r);
  });

});
