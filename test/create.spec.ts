import * as Rx from 'rxjs/Rx';

import { runTwo, runTwoDouble, runTwoFn } from './create-helper';

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
