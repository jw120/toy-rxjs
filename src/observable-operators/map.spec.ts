import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { itObs, describeObsAsync, describeObsTimedAsync } from '../test-helpers/compare';

const input: number[] = [1, 9, 8, 4];
const double: (x: number) => number = (x: number) => x * 2;
const triple: (x: number) => number = (x: number) => x * 3;
const toIndex: (x: number, i: number) => number = (x: number, i: number) => { x = x; return i; };
const timesIndex: (x: number, i: number) => number = (x: number, i: number) => x * i;
const doubled: string[] = ['next 2', 'next 18', 'next 16', 'next 8', 'complete'];
const tripled: string[] = ['next 3', 'next 27', 'next 24', 'next 12', 'complete'];
const indices: string[] = ['next 0', 'next 1', 'next 2', 'next 3', 'complete'];
const timesIndices: string[] = ['next 0', 'next 9', 'next 16', 'next 12', 'complete'];
const testMsg: string = 'testErr';

describe('map operator (with synchronous observable)', () => {

  itObs('should work with doubling',
    ToyRx.Observable.of(...input).map(double),
    RefRx.Observable.of(...input).map(double),
    doubled
  );

  itObs('should work with toIndex',
    ToyRx.Observable.of(...input).map(toIndex),
    RefRx.Observable.of(...input).map(toIndex),
    indices
  );

  itObs('should work with timesIndex',
    ToyRx.Observable.of(...input).map(timesIndex),
    RefRx.Observable.of(...input).map(timesIndex),
    timesIndices
  );

  itObs('should work with an error',
    ToyRx.Observable.throw(Error(testMsg)).map(double),
    RefRx.Observable.throw(Error(testMsg)).map(double),
    ['error ' + testMsg]
  );

  itObs('should work with nothing',
    ToyRx.Observable.never().map(double),
    RefRx.Observable.never().map(double),
    []
  );

});

describeObsAsync('map operator (with asynchronous observable)', 'should work with tripling',
  ToyRx.Observable.of(...input).map(triple),
  RefRx.Observable.of(...input).map(triple),
  tripled
);

describeObsTimedAsync('map operator (with asynchronous observable)', 'should work with timeout',
  ToyRx.Observable.interval(100).map(toIndex),
  RefRx.Observable.interval(100).map(toIndex),
  [100, 200, 300, 400],
  ['next 0', 'next 1', 'next 2', 'next 3'],
  450
);
