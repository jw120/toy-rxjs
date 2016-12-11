import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { completeEmits, itObs, describeObsAsync } from '../test-helpers/compare';

const in1: Array<number> = [1, 3, 5, 8];
function f1(acc: number, x: number): number {
  return acc + x;
}
function f2(acc: Array<string>, x: number): Array<string> {
  acc.push('-');
  acc.push((3 * x).toString());
  return acc;
}

describe('reduce operator (with synchronous observable)', () => {

  itObs('should work with numbers',
    ToyRx.Observable.from(in1).reduce(f1),
    RefRx.Observable.from(in1).reduce(f1),
    completeEmits(17)
  );

  itObs('should work with numbers and a seed',
    ToyRx.Observable.from(in1).reduce(f1, 7),
    RefRx.Observable.from(in1).reduce(f1, 7),
    completeEmits(24)
  );

  itObs('should pass through an error',
    ToyRx.Observable.throw(Error('err')).reduce(f1),
    RefRx.Observable.throw(Error('err')).reduce(f1),
    ['error err']
  );

  itObs('should work with mixed types and a seed',
    ToyRx.Observable.from(in1).reduce(f2, ['!!']),
    RefRx.Observable.from(in1).reduce(f2, ['!!']),
    completeEmits(['!!', '-', '3', '-', '9', '-', '15', '-', '24'])
  );

});

describeObsAsync('reduce operator (with asynchronous observable)', 'should work',
  ToyRx.Observable.interval(50).take(4).reduce(f1),
  RefRx.Observable.interval(50).take(4).reduce(f1),
  completeEmits(6)
);
