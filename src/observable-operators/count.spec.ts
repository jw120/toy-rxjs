import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { completeEmits, itObs, describeObsAsync } from '../test-helpers/compare';

const in1: Array<number> = [1, 2, 3, 5, 8, 10];
function f1(x: number): boolean { return x >= 3; }
function f2(_x: number, i: number): boolean { return i % 2 === 0; }

describe('count operator (with synchronous observable)', () => {

  itObs('should work with no predicate',
    ToyRx.Observable.from(in1).count(),
    RefRx.Observable.from(in1).count(),
    completeEmits(6)
  );

  itObs('should work with a predicate on the value',
    ToyRx.Observable.from(in1).count(f1),
    RefRx.Observable.from(in1).count(f1),
    completeEmits(4)
  );

  itObs('should work with a predicate on the index',
    ToyRx.Observable.from(in1).count(f2),
    RefRx.Observable.from(in1).count(f2),
    completeEmits(3)
  );

});

describeObsAsync('count operator (with asynchronous observable)', 'should work',
  ToyRx.Observable.interval(10).take(10).count(f2),
  RefRx.Observable.interval(10).take(10).count(f2),
  completeEmits(5)
);
