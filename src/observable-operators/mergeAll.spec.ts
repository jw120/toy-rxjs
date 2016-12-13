import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {
  completeEmits, errorEmits, /*, incompleteEmits, */ itObs, describeObsTimedAsync
} from '../test-helpers/compare';

describe('mergeAll operator (synchronous - which is the same as concatAll)', () => {

  const in1: Array<Array<number>> = [ [1, 2, 3], [4, 6], [], [8] ];
  const toy1: ToyRx.Observable<ToyRx.Observable<number>> =
    ToyRx.Observable.from(in1.map((xs: Array<number>) => ToyRx.Observable.from(xs)));
  const ref1: RefRx.Observable<RefRx.Observable<number>> =
    RefRx.Observable.from(in1.map((xs: Array<number>) => RefRx.Observable.from(xs)));

  itObs('should work with complete observables',
    toy1.mergeAll(),
    ref1.mergeAll(),
    completeEmits(1, 2, 3, 4, 6, 8)
  );

  const toy2: Array<ToyRx.Observable<number>> =
    [ ToyRx.Observable.throw(Error('ee')), ToyRx.Observable.of(1, 2), ToyRx.Observable.of(3, 5) ];
  const ref2: Array<RefRx.Observable<number>> =
    [RefRx.Observable.throw(Error('ee')),  RefRx.Observable.of(1, 2), RefRx.Observable.of(3, 5) ];
  itObs('should work with an error in first inner observable',
    ToyRx.Observable.from(toy2).mergeAll(),
    RefRx.Observable.from(ref2).mergeAll(),
    errorEmits('ee')
  );

  const toy3: Array<ToyRx.Observable<number>> =
    [ ToyRx.Observable.of(1, 2), ToyRx.Observable.throw(Error('ee')), ToyRx.Observable.of(3, 5) ];
  const ref3: Array<RefRx.Observable<number>> =
    [ RefRx.Observable.of(1, 2), RefRx.Observable.throw(Error('ee')), RefRx.Observable.of(3, 5) ];
  itObs('should work with an error in second inner observable stream',
    ToyRx.Observable.from(toy3).mergeAll(),
    RefRx.Observable.from(ref3).mergeAll(),
    errorEmits('ee', 1, 2)
  );

  const toy4: ToyRx.Observable<ToyRx.Observable<number>> = ToyRx.Observable.throw(Error('outer e'));
  const ref4: RefRx.Observable<RefRx.Observable<number>> = RefRx.Observable.throw(Error('outer e'));
  itObs('should work with an error in the outer observable',
    ToyRx.Observable.from(toy4).mergeAll(),
    RefRx.Observable.from(ref4).mergeAll(),
    errorEmits('outer e')
  );

});

const toy1A: ToyRx.Observable<number> = ToyRx.Observable.of(1, 2, 3, ToyRx.Scheduler.async);
const toy1B: ToyRx.Observable<number> = ToyRx.Observable.of(5, 7, 9, ToyRx.Scheduler.async);
const toy1: ToyRx.Observable<ToyRx.Observable<number>> = ToyRx.Observable.of(toy1A, toy1B);
const ref1A: RefRx.Observable<number> = RefRx.Observable.of(1, 2, 3, RefRx.Scheduler.async);
const ref1B: RefRx.Observable<number> = RefRx.Observable.of(5, 7, 9, RefRx.Scheduler.async);
const ref1: RefRx.Observable<RefRx.Observable<number>> = RefRx.Observable.of(ref1A, ref1B);
describeObsTimedAsync('mergeAll operator (sync of async)',  'should work',
  () => toy1.mergeAll(),
  () => ref1.mergeAll(),
  [0, 0, 0, 0, 0, 0, 0],
  completeEmits(1, 5, 2, 7, 3, 9)
);

const toy2A: ToyRx.Observable<number> = ToyRx.Observable.of(1, 2, 3, ToyRx.Scheduler.async);
const toy2B: ToyRx.Observable<number> = ToyRx.Observable.of(5, 7, 8, ToyRx.Scheduler.async);
const toy2: ToyRx.Observable<ToyRx.Observable<number>> = ToyRx.Observable.of(toy2A, toy2B, ToyRx.Scheduler.async);
const ref2A: RefRx.Observable<number> = RefRx.Observable.of(1, 2, 3, RefRx.Scheduler.async);
const ref2B: RefRx.Observable<number> = RefRx.Observable.of(5, 7, 8, RefRx.Scheduler.async);
const ref2: RefRx.Observable<RefRx.Observable<number>> = RefRx.Observable.of(ref2A, ref2B, RefRx.Scheduler.async);
describeObsTimedAsync('mergeAll operator (async of async)',  'should work',
  () => toy2.mergeAll(),
  () => ref2.mergeAll(),
  [0, 0, 0, 0, 0, 0, 0],
  completeEmits(1, 2, 5, 3, 7, 8)
);
