/**
 *
 * fromPromise tests taken from rxjs (and converted from mocha to jasmine)
 *
 */

import * as Rx from '../Rx';

// declare const process: any;

describe('Rx.Observable.fromPromise', () => {
  it('should emit one value from a resolved promise', (done: DoneFn) => {
    const promise: Promise<number> = Promise.resolve(42);
    Rx.Observable.fromPromise(promise)
      .subscribe(
        (x: number) => { expect(x).toEqual(42); },
        () => {
          throw(new Error('should not be called'));
        }, () => {
          done();
        });
  });

  it('should raise error from a rejected promise', (done: DoneFn) => {
    const promise: Promise<number> = Promise.reject('bad');
    Rx.Observable.fromPromise(promise)
      .subscribe(() => {
          throw(new Error('should not be called'));
        },
        (e: any) => {
          expect(e).toEqual('bad');
          done();
        }, () => {
         throw(new Error('should not be called'));
       });
  });

  it('should share the underlying promise with multiple subscribers', (done: DoneFn) => {
    const promise: Promise<number> = Promise.resolve(42);
    const obs: Rx.Observable<number> = Rx.Observable.fromPromise(promise);

    obs
      .subscribe(
        (x: number) => { expect(x).toEqual(42); },
        () => {
          throw(new Error('should not be called'));
        }, null);
    setTimeout(() => {
      obs
        .subscribe(
          (x: number) => { expect(x).toEqual(42); },
          () => {
            throw(new Error('should not be called'));
          }, () => {
            done();
          });
    });
  });

  it('should accept already-resolved Promise', (done: DoneFn) => {
    const promise: Promise<number> = Promise.resolve(42);
    promise.then((x: number) => {
      expect(x).toEqual(42);
      Rx.Observable.fromPromise(promise)
        .subscribe(
          (y: number) => { expect(y).toEqual(42); },
          () => {
            throw(new Error('should not be called'));
          }, () => {
            done();
          });
    }, () => {
      throw(new Error('should not be called'));
    });
  });

/*
  it('should emit a value from a resolved promise on a separate scheduler', (done: DoneFn) => {
    const promise = Promise.resolve(42);
    Rx.Observable.fromPromise(promise, Rx.Scheduler.asap)
      .subscribe(
        (x: number) => { expect(x).toEqual(42); },
        (x) => {
          throw(new Error('should not be called'));
        }, () => {
          done();
        });
  });

  it('should raise error from a rejected promise on a separate scheduler', (done: DoneFn) => {
    const promise = Promise.reject('bad');
    Rx.Observable.fromPromise(promise, Rx.Scheduler.asap)
      .subscribe(
        (x: any) => { throw(new Error('should not be called')); },
        (e: any) => {
          expect(e).toEqual('bad');
          done();
        }, () => {
          throw(new Error('should not be called'));
        });
  });

  it('should share the underlying promise with multiple subscribers on a separate scheduler', (done: DoneFn) => {
    const promise = Promise.resolve(42);
    const Rx.Observable = Rx.Observable.fromPromise(promise, Rx.Scheduler.asap);

    Rx.Observable
      .subscribe(
        (x: number) => { expect(x).toEqual(42); },
        (x) => {
          throw(new Error('should not be called'));
        },
        null);
    setTimeout(() => {
      Rx.Observable
        .subscribe(
          (x: number) => { expect(x).toEqual(42); },
          (x) => {
            throw(new Error('should not be called'));
          }, () => {
            done();
          });
    });
  });
  */

  it('should not emit, throw or complete if immediately unsubscribed', (done: DoneFn) => {
    const nextSpy: jasmine.Spy = jasmine.createSpy('nextSpy');
    const throwSpy: jasmine.Spy = jasmine.createSpy('throwSpy');
    const completeSpy: jasmine.Spy = jasmine.createSpy('completeSpy');
    const promise: Promise<number> = Promise.resolve(42);
    const subscription: Rx.Subscription = Rx.Observable.fromPromise(promise)
      .subscribe(nextSpy, throwSpy, completeSpy);
    subscription.unsubscribe();

    setTimeout(() => {
      expect(nextSpy).not.toHaveBeenCalled();
      expect(throwSpy).not.toHaveBeenCalled();
      expect(completeSpy).not.toHaveBeenCalled();
      done();
    });
  });

});
