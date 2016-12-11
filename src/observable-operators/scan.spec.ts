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

describe('scan operator (with synchronous observable)', () => {

  itObs('should work with numbers',
    ToyRx.Observable.from(in1).scan(f1),
    RefRx.Observable.from(in1).scan(f1),
    completeEmits(1, 4, 9, 17)
  );

  itObs('should work with numbers and a seed',
    ToyRx.Observable.from(in1).scan(f1, 7),
    RefRx.Observable.from(in1).scan(f1, 7),
    completeEmits(8, 11, 16, 24)
  );

  itObs('should pass through an error',
    ToyRx.Observable.throw(Error('err')).scan(f1),
    RefRx.Observable.throw(Error('err')).scan(f1),
    ['error err']
  );

  itObs('should work with mixed types and a seed',
    ToyRx.Observable.from(in1).take(2).scan(f2, ['!']),
    RefRx.Observable.from(in1).take(2).scan(f2, ['!']),
    completeEmits(
      ['!', '-', '3'],
      ['!', '-', '3', '-', '9']
    )
  );

});

describeObsAsync('scan operator (with asynchronous observable)', 'should work',
  ToyRx.Observable.interval(50).take(4).scan(f1),
  RefRx.Observable.interval(50).take(4).scan(f1),
  completeEmits(0, 1, 3, 6)
);
