import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { itObs, describeObsAsync, describeObsTimedAsync, completeEmits } from '../test-helpers/compare';
import { TimedLog, mkTimedLog } from '../test-helpers/log';

// Creates a promise that resolves to the given number
function mkPromise(x: number, delay?: number): Promise<number> {
  return new Promise((resolve: (v: number) => void) => {
    if (delay) { console.log('setTimeout for delay', x, delay); }
    setTimeout(() => { console.log('setTimeout returns', x); resolve(x); }, delay || 1);
  });
}
function mkRejectPromise(e: Error, delay?: number): Promise<number> {
  return new Promise((_resolve: (v: number) => void, reject: (reason: any) => void) => {
    setTimeout(() => reject(e), delay || 1);
  });
}

describe('Observable.fromPromise (synchronous)', () => {
  itObs('should do nothing with a resolved Promise',
    ToyRx.Observable.fromPromise(Promise.resolve(3)),
    RefRx.Observable.fromPromise(Promise.resolve(3)),
    []
  );
});

describe('Observable.fromPromise (synchronous)', () => {
  itObs('should do nothing with a rejected Promise',
    ToyRx.Observable.fromPromise(Promise.reject('reason')),
    RefRx.Observable.fromPromise(Promise.reject('reason')),
    []
  );
});

// const p1: Promise<number> = new Promise((resolve: (x: number) => void) => {
//   setTimeout(resolve(4), 0);
// });
describeObsAsync('Observable.fromPromise (asynchronous)', 'works with async resolve',
  ToyRx.Observable.fromPromise(mkPromise(4)),
  RefRx.Observable.fromPromise(mkPromise(4)),
  completeEmits(4)
);

// const p2: Promise<number> = new Promise((_resolve: () => void, reject: (x: any) => void) => {
//   setTimeout(reject(Error('why')), 0);
// });
describeObsAsync('Observable.fromPromise (asynchronous)', 'works with async reject Error',
  ToyRx.Observable.fromPromise(mkRejectPromise(Error('why'))),
  RefRx.Observable.fromPromise(mkRejectPromise(Error('why'))),
  ['error why']
);

// const p3: Promise<number> = new Promise((resolve: (p: Promise<number>) => void) => {
//   setTimeout(resolve(p1), 0);
// });
// describeObsAsync('Observable.fromPromise (asynchronous)', 'works with chained async resolve',
//   ToyRx.Observable.fromPromise(p3),
//   RefRx.Observable.fromPromise(p3),
//   completeEmits(4)
// );

// LIMITATION - Our timing is different
// const p4: Promise<number> = new Promise((resolve: (p: number) => void) => {
//   console.log('p4 create');
//   setTimeout(() => { console.log('p4 resolve'); resolve(66); }, 500);
// });
describeObsTimedAsync('Observable.fromPromise (asynchronous)', 'works asynchronously to time',
  ToyRx.Observable.fromPromise(mkPromise(65, 200)),
  RefRx.Observable.fromPromise(mkPromise(65, 200)),
  [200, 200],
  completeEmits(65)
);

 describe('describeMessage', () => {

    let toyLog: TimedLog<number>;
    let refLog: TimedLog<number>;
    let expLog: TimedLog<number> = mkTimedLog([200, 200], ['next 66', 'complete']);

    it(`ToyRx logging (itMessage)`, (done: DoneFn) => {
      toyLog = new TimedLog(done);
      ToyRx.Observable.fromPromise(mkPromise(66, 200)).subscribe(toyLog);
    });

    it('(ToyRx)', () => {
      expect(toyLog).toEqual(expLog);
    });

    it(`RefRx logging (itMessage`, (done: DoneFn) => {
      refLog = new TimedLog(done);
      RefRx.Observable.fromPromise(mkPromise(66, 200)).subscribe(refLog);
    });

    it('(RefRx)', () => {
      console.log('explicit version', refLog._log);
      expect(refLog).toEqual(expLog);
    });

  });
