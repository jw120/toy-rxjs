import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { compare2Sync, compare2Async } from '../test-helpers/compare';

describe('Observable.of synchronous', () => {

  const testArgs: number[] = [1, 3, 2, 7];

  compare2Sync('should work with no scheduler specified',
    ToyRx.Observable.of(...testArgs),
    RefRx.Observable.of(...testArgs),
    ['next 1', 'next 3', 'next 2', 'next 7', 'complete']
  );

  compare2Sync('should work with the synchronous scheduler specified',
    ToyRx.Observable.of(...testArgs, ToyRx.Scheduler.sync),
    RefRx.Observable.of(...testArgs),
    ['next 1', 'next 3', 'next 2', 'next 7', 'complete']
  );

});

describe('Observable.of asynchronous', () => {

  const testArgs: number[] = [1, 6, 2, 7];

  compare2Async('should work',
    ToyRx.Observable.of<number>(...testArgs, ToyRx.Scheduler.async),
    RefRx.Observable.of<number>(...testArgs, RefRx.Scheduler.async),
    ['next 1', 'next 6', 'next 2', 'next 7', 'complete']
  );

});

describe('Observable.empty (synchronous)', () => {

  compare2Sync('should work with no scheduler specified',
    ToyRx.Observable.empty(),
    RefRx.Observable.empty(),
    ['complete']
  );

  compare2Sync('should work with the synchronous scheduler specified',
    ToyRx.Observable.empty(ToyRx.Scheduler.sync),
    RefRx.Observable.empty(null),
    ['complete']
  );

});

describe('Observable.empty asynchronous', () => {

  compare2Async('should work',
    ToyRx.Observable.empty<number>(ToyRx.Scheduler.async),
    RefRx.Observable.empty<number>(RefRx.Scheduler.async),
    ['complete']
  );

});

describe('Observable.range synchronous', () => {

  compare2Sync('should work with no scheduler specified',
    ToyRx.Observable.range(7, 3),
    RefRx.Observable.range(7, 3),
    ['next 7', 'next 8', 'next 9', 'complete']
  );

  compare2Sync('should work with the synchronous scheduler specified',
    ToyRx.Observable.range(6, 2, ToyRx.Scheduler.sync),
    RefRx.Observable.range(6, 2, null),
    ['next 6', 'next 7', 'complete']
  );

});

describe('Observable.range asynchronous', () => {

  compare2Async('should work',
    ToyRx.Observable.range(5, 3, ToyRx.Scheduler.async),
    RefRx.Observable.range(5, 3, RefRx.Scheduler.async),
    ['next 5', 'next 6', 'next 7', 'complete']
  );

});

describe('Observable.interval operator (asynchronos)', () => {

  compare2Async('should work with take',
    ToyRx.Observable.interval(100).take(4),
    RefRx.Observable.interval(100).take(4),
    ['next 0', 'next 1', 'next 2', 'next 3', 'complete']
  );

  compare2Async('should work with a timeout',
    ToyRx.Observable.interval(100),
    RefRx.Observable.interval(100),
    ['next 0', 'next 1', 'next 2'],
    350
  );

});
