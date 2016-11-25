import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {
  completeEmits, incompleteEmits,
  itObs, describeObsAsync, describeObsTimedAsync
} from '../test-helpers/compare';

const input: number[] = [1, 9, 8, 6];
const isEven: (x: number) => boolean = (x: number) => x % 2 === 0;
const isMult3: (x: number) => boolean = (x: number) => x % 3 === 0;
const testMsg: string = 'tst';

describe('filter operator (with synchronous observable)', () => {

  itObs('should work with isEven',
    ToyRx.Observable.from(input).filter(isEven),
    RefRx.Observable.from(input).filter(isEven),
    completeEmits(8, 6)
  );

  itObs('should work with isMult3',
    ToyRx.Observable.from(input).filter(isMult3),
    RefRx.Observable.from(input).filter(isMult3),
    completeEmits(9, 6)
  );

  itObs('should work with an error',
    ToyRx.Observable.throw(Error(testMsg)).filter(isEven),
    RefRx.Observable.throw(Error(testMsg)).filter(isEven),
    ['error ' + testMsg]
  );

  itObs('should work with nothing',
    ToyRx.Observable.never().filter(isEven),
    RefRx.Observable.never().filter(isEven),
    []
  );

});

describeObsAsync('map operator (with asynchronous observable)', 'should work with tripling',
  ToyRx.Observable.interval(50).take(5).filter(isEven),
  RefRx.Observable.interval(50).take(5).filter(isEven),
  completeEmits(0, 2, 4)
);

describeObsTimedAsync('map operator (with asynchronous observable)', 'should work with timeout',
  () => ToyRx.Observable.interval(50).take(10).filter(isMult3),
  () => RefRx.Observable.interval(50).take(10).filter(isMult3),
  [50, 200, 350],
  incompleteEmits(0, 3, 6),
  500
);
