import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {
  describeObsAsync, describeObsTimedAsync, itObs,
  completeEmits, incompleteEmits
} from '../test-helpers/compare';

const testMsg: string = 'takeMessage';

describe('take operator (with synchronous observable)', () => {

  itObs('should work to shorten',
    ToyRx.Observable.range(3, 4).take(3),
    RefRx.Observable.range(3, 4).take(3),
    completeEmits(3, 4, 5)
  );

  itObs('should work to not over-shorten',
    ToyRx.Observable.range(3, 4).take(7),
    RefRx.Observable.range(3, 4).take(7),
    completeEmits(3, 4, 5, 6)
  );

  itObs('should work to zero',
    ToyRx.Observable.range(3, 4).take(0),
    RefRx.Observable.range(3, 4).take(0),
    ['complete']
  );

  itObs('should work with an error',
    ToyRx.Observable.throw(Error(testMsg)).take(4),
    RefRx.Observable.throw(Error(testMsg)).take(4),
    ['error ' + testMsg]
  );

  itObs('should work with nothing',
    ToyRx.Observable.never().take(3),
    RefRx.Observable.never().take(3),
    []
  );

});

describeObsAsync('take operator (with asynchronous observable)', 'should work with completed observable',
  ToyRx.Observable.range(7, 4, ToyRx.Scheduler.async).take(3),
  RefRx.Observable.range(7, 4, RefRx.Scheduler.async).take(3),
  completeEmits(7, 8, 9)
);

describeObsTimedAsync('take operator (with asynchronous observable)', 'should work with timing',
  () => ToyRx.Observable.interval(100).take(3),
  () => RefRx.Observable.interval(100).take(3),
  [100, 200, 300, 300],
  completeEmits(0, 1, 2)
);

describeObsTimedAsync('take operator (with asynchronous observable)', 'should work with while-active timeout',
  () => ToyRx.Observable.interval(150).take(3),
  () => RefRx.Observable.interval(150).take(3),
  [150, 300],
  incompleteEmits(0, 1),
  350
);

describeObsTimedAsync('take operator (with asynchronous observable)', 'should work with after-the-fact timeout',
  () => ToyRx.Observable.interval(150).take(2),
  () => RefRx.Observable.interval(150).take(2),
  [150, 300, 300],
  completeEmits(0, 1),
  350
);
