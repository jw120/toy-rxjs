import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { itObs, describeObsAsync, describeObsTimedAsync, completeEmits } from '../test-helpers/compare';

// Creates a promise that resolves to the given number
function mkPromise(x: number, delay?: number): Promise<number> {
  return new Promise((resolve: (v: number) => void) => {
    setTimeout(() => resolve(x), delay || 1);
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

describeObsTimedAsync('2Observable.fromPromise (asynchronous)', 'works asynchronously to time',
  () => ToyRx.Observable.fromPromise(mkPromise(65, 200)),
  () => RefRx.Observable.fromPromise(mkPromise(65, 200)),
  [200, 200],
  completeEmits(65)
);
