import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { it2Sync, describe2Async, describe2AsyncClose } from '../test-helpers/compare';

describe('Observable.of synchronous', () => {

  const testArgs: number[] = [1, 3, 2, 7];

  it2Sync('should work with no scheduler specified',
    ToyRx.Observable.of(...testArgs),
    RefRx.Observable.of(...testArgs),
    ['next 1', 'next 3', 'next 2', 'next 7', 'complete']
  );

  it2Sync('should work with the synchronous scheduler specified',
    ToyRx.Observable.of(...testArgs, ToyRx.Scheduler.sync),
    RefRx.Observable.of(...testArgs),
    ['next 1', 'next 3', 'next 2', 'next 7', 'complete']
  );

});

describe2Async('Observable.of asynchronous', 'should work',
  ToyRx.Observable.of<number>(1, 6, 2, 7, ToyRx.Scheduler.async),
  RefRx.Observable.of<number>(1, 6, 2, 7, RefRx.Scheduler.async),
  ['next 1', 'next 6', 'next 2', 'next 7', 'complete']
);

describe('Observable.empty (synchronous)', () => {

  it2Sync('should work with no scheduler specified',
    ToyRx.Observable.empty(),
    RefRx.Observable.empty(),
    ['complete']
  );

  it2Sync('should work with the synchronous scheduler specified',
    ToyRx.Observable.empty(ToyRx.Scheduler.sync),
    RefRx.Observable.empty(null),
    ['complete']
  );

});

describe2Async('Observable.empty asynchronous', 'should work',
  ToyRx.Observable.empty<number>(ToyRx.Scheduler.async),
  RefRx.Observable.empty<number>(RefRx.Scheduler.async),
  ['complete']
);

describe('Observable.range synchronous', () => {

  it2Sync('should work with no scheduler specified',
    ToyRx.Observable.range(7, 3),
    RefRx.Observable.range(7, 3),
    ['next 7', 'next 8', 'next 9', 'complete']
  );

  it2Sync('should work with the synchronous scheduler specified',
    ToyRx.Observable.range(6, 2, ToyRx.Scheduler.sync),
    RefRx.Observable.range(6, 2, null),
    ['next 6', 'next 7', 'complete']
  );

});

describe2Async('Observable.range asynchronous', 'should work',
  ToyRx.Observable.range(5, 3, ToyRx.Scheduler.async),
  RefRx.Observable.range(5, 3, RefRx.Scheduler.async),
  ['next 5', 'next 6', 'next 7', 'complete']
);

describe2AsyncClose('Observable.interval operator (asynchronos)', 'should work with times',
  ToyRx.Observable.interval(100),
  RefRx.Observable.interval(100),
  [100, 200, 300],
  ['next 0', 'next 1', 'next 2'],
  [-10, 25],
  350
);

describe2Async('Observable.interval operator (asynchronos)', 'should work with take',
  ToyRx.Observable.interval(100).take(4),
  RefRx.Observable.interval(100).take(4),
  ['next 0', 'next 1', 'next 2', 'next 3', 'complete']
);

describe2Async('Observable.interval operator (asynchronos)', 'should work with a timeout',
  ToyRx.Observable.interval(100),
  RefRx.Observable.interval(100),
  ['next 0', 'next 1', 'next 2'],
  350
);