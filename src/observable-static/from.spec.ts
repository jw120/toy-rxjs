import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

// Test for from borrowed from rxjs

import { completeEmits, typeCheckOnly, itObs } from '../test-helpers/compare';

describe('Observable.from', () => {

  itObs('should create an observable from an array',
    ToyRx.Observable.from([10, 20, 30]),
    RefRx.Observable.from([10, 20, 30]),
    completeEmits(10, 20, 30)
  );

  const nonObservable: any = {};
  it('should throw for non observable object', () => {
    function toyFn(): void { ToyRx.Observable.from(nonObservable).subscribe(); }
    expect(toyFn).toThrow();
  });

  it('should return T for ObservableLike objects', () => {
    typeCheckOnly(() => {
      /* tslint:disable:no-unused-variable */
      let t1: ToyRx.Observable<number> = ToyRx.Observable.from(<Array<number>> [], ToyRx.Scheduler.async);
      let t2: ToyRx.Observable<{ a: string }> = ToyRx.Observable.from(ToyRx.Observable.empty<{ a: string}>());
      let t3: ToyRx.Observable<{ b: number }> =
        ToyRx.Observable.from(new Promise<{b: number}>((resolve: Function) => resolve()));
      /* tslint:enable:no-unused-variable */
    });
  });

  it('should return T for arrays', () => {
    typeCheckOnly(() => {
      /* tslint:disable:no-unused-variable */
      let t1: ToyRx.Observable<number> = ToyRx.Observable.from(<Array<number>> [], ToyRx.Scheduler.async);
      let r1: ToyRx.Observable<number> = ToyRx.Observable.from(<Array<number>> [], ToyRx.Scheduler.async);
      /* tslint:enable:no-unused-variable */
    });
  });

  // LIMITATION: Symbol.observable not implemented
  // const fakervable: any = (...values: any[]) => ({
  //   [<symbol>Symbol.observable]: () => ({
  //     subscribe: (observer: RefRx.Observer<string>) => {
  //       for (const value of values) {
  //         observer.next(value);
  //       }
  //       observer.complete();
  //     }
  //   })
  // });

  const fakerator: any = (...values: Array<any>) => ({
    [<symbol> Symbol.iterator]: () => {
      const clone: Array<any> = [...values];
      return {
        next: () => ({
          done: clone.length <= 0,
          value: clone.shift()
        })
      };
    }
  });

  const sources: Array<{ name: string, value: any }> = [
    { name: 'observable', value: ToyRx.Observable.of('x') },
//    { name: 'observable-like', value: fakervable('x') },
    { name: 'array', value: ['x'] },
    { name: 'promise', value: Promise.resolve('x') },
    { name: 'iterator', value: fakerator('x') },
    { name: 'array-like', value: { [0]: 'x', length: 1 }},
    { name: 'string', value: 'x'},
    /* tslint:disable:only-arrow-functions */ // arguments does not work with arrow functions
    { name: 'arguments', value: (function (_x: any): any { return arguments; })('x') }
    /* tslint:enable:only-arrow-functions */
  ];

  for (const source of sources) {
    it(`should accept ${source.name}`, (done: DoneFn) => {
      let nextInvoked: boolean = false;
      ToyRx.Observable.from(source.value)
        .subscribe(
          (x: string) => { nextInvoked = true; expect(x).toBe('x'); },
          () => { throw Error('should not be called'); },
          () => { expect(nextInvoked).toBe(true); done(); }
        );
    });
    // LIMITATION: Don't support asap scheduler
    // it(`should accept ${source.name} and scheduler`, (done: DoneFn) => {
    //   let nextInvoked: boolean = false;
    //   ToyRx.Observable.from(source.value, ToyRx.Scheduler.asap)
    //    .subscribe(
    //       (x: string) => { nextInvoked = true; expect(x).toBe('x'); },
    //       () => { throw Error('should not be called'); },
    //       () => { expect(nextInvoked).toBe(true); done(); }
    //     );
    //   expect(nextInvoked).toBe(false);
    // });
  }
});
