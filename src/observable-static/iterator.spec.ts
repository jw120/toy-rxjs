import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { completeEmits, incompleteEmits,
  itObs, describeObsAsync, describeObsTimedAsync } from '../test-helpers/compare';

describe('Observable.of synchronous', () => {

  const testArgs: number[] = [1, 3, 2, 7];

  itObs('should work with no scheduler specified',
    ToyRx.Observable.of(...testArgs),
    RefRx.Observable.of(...testArgs),
    completeEmits(1, 3, 2, 7)
  );

  itObs('should work with the synchronous scheduler specified',
    ToyRx.Observable.of(...testArgs, ToyRx.Scheduler.sync),
    RefRx.Observable.of(...testArgs),
    completeEmits(1, 3, 2, 7)
  );

});

describeObsAsync('Observable.of asynchronous', 'should work',
  ToyRx.Observable.of<number>(1, 6, 2, 7, ToyRx.Scheduler.async),
  RefRx.Observable.of<number>(1, 6, 2, 7, RefRx.Scheduler.async),
  completeEmits(1, 6, 2, 7)
);

describe('Observable.empty (synchronous)', () => {

  itObs('should work with no scheduler specified',
    ToyRx.Observable.empty(),
    RefRx.Observable.empty(),
    ['complete']
  );

  itObs('should work with the synchronous scheduler specified',
    ToyRx.Observable.empty(ToyRx.Scheduler.sync),
    RefRx.Observable.empty(null),
    ['complete']
  );

});

describeObsAsync('Observable.empty asynchronous', 'should work',
  ToyRx.Observable.empty<number>(ToyRx.Scheduler.async),
  RefRx.Observable.empty<number>(RefRx.Scheduler.async),
  ['complete']
);

describe('Observable.range synchronous', () => {

  itObs('should work with no scheduler specified',
    ToyRx.Observable.range(7, 3),
    RefRx.Observable.range(7, 3),
    completeEmits(7, 8, 9)
  );

  itObs('should work with the synchronous scheduler specified',
    ToyRx.Observable.range(6, 2, ToyRx.Scheduler.sync),
    RefRx.Observable.range(6, 2, null),
    completeEmits(6, 7)
  );

});

describeObsAsync('Observable.range asynchronous', 'should work',
  ToyRx.Observable.range(5, 3, ToyRx.Scheduler.async),
  RefRx.Observable.range(5, 3, RefRx.Scheduler.async),
  completeEmits(5, 6, 7)
);

describeObsTimedAsync('Observable.interval operator (asynchronos)', 'should work with times',
  () => ToyRx.Observable.interval(100),
  () => RefRx.Observable.interval(100),
  [100, 200, 300],
  incompleteEmits(0, 1, 2),
  350
);

describeObsAsync('Observable.interval operator (asynchronos)', 'should work with take',
  ToyRx.Observable.interval(100).take(4),
  RefRx.Observable.interval(100).take(4),
  completeEmits(0, 1, 2, 3)
);

describeObsAsync('Observable.interval operator (asynchronos)', 'should work with a timeout',
  ToyRx.Observable.interval(100),
  RefRx.Observable.interval(100),
  incompleteEmits(0, 1, 2),
  350
);
