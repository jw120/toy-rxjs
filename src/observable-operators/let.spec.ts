import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {
  completeEmits, incompleteEmits, itObs, describeObsAsync, describeObsTimedAsync
} from '../test-helpers/compare';

const input: Array<number> = [1, 9, 8, 4];
function double(x: number): number { return x * 2; }
function toyDoubleMap(o: ToyRx.Observable<number>): ToyRx.Observable<number> { return o.map(double); }
function refDoubleMap(o: RefRx.Observable<number>): RefRx.Observable<number> { return o.map(double); }
const doubled: Array<string> = completeEmits(2, 18, 16, 8);
function toySelfTake(o: ToyRx.Observable<number>): ToyRx.Observable<number> { return o.take(2); }
function refSelfTake(o: RefRx.Observable<number>): RefRx.Observable<number> { return o.take(2); }

describe('let operator (with synchronous observable)', () => {

  itObs('should work with doubleMap',
    ToyRx.Observable.from(input).let(toyDoubleMap),
    RefRx.Observable.from(input).let(refDoubleMap),
    doubled
  );

  itObs('should with with selfTake',
    ToyRx.Observable.range(1, 3).let(toySelfTake),
    RefRx.Observable.range(1, 3).let(refSelfTake),
    completeEmits(1, 2)
  );

});

describeObsAsync('let operator (with asynchronous observable)', 'should work with doubleMap',
  ToyRx.Observable.interval(100).take(4).let(toyDoubleMap),
  RefRx.Observable.interval(100).take(4).let(refDoubleMap),
  completeEmits(0, 2, 4, 6)
);

describeObsTimedAsync('let operator (with asynchronous observable)', 'should work with timeout',
  () => ToyRx.Observable.interval(100).let(toyDoubleMap),
  () => RefRx.Observable.interval(100).let(refDoubleMap),
  [100, 200, 300, 400],
  incompleteEmits(0, 2, 4, 6),
  450
);
