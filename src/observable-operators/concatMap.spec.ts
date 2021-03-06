import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {  completeEmits, errorEmits, itObs, describeObsAsync } from '../test-helpers/compare';

// Replace 1 with ['a'], 2 with ['b', 'b'] etc
function letterMap(x: number): Array<string> {
  return (new Array(x)).fill(String.fromCharCode('a'.charCodeAt(0) + x - 1));
}

function sel(outerVal: number, innerVal: string, outerIndex: number, innerIndex: number): string {
  return `${outerVal}-${innerVal}-${outerIndex}-${innerIndex}`;
}

describe('concatMap operator (synchronous)', () => {

  const in1: Array<number> = [ 1, 3, 2];
  itObs('should work with complete observables',
    ToyRx.Observable.from(in1).concatMap((x: number) => ToyRx.Observable.from(letterMap(x))),
    RefRx.Observable.from(in1).concatMap((x: number) => RefRx.Observable.from(letterMap(x))),
    completeEmits('a', 'c', 'c', 'c', 'b', 'b')
  );

  itObs('should work with complete observables and a result selector',
    ToyRx.Observable.from(in1).concatMap((x: number) => ToyRx.Observable.from(letterMap(x)), sel),
    RefRx.Observable.from(in1).concatMap((x: number) => RefRx.Observable.from(letterMap(x)), sel),
    completeEmits('1-a-0-0', '3-c-1-0', '3-c-1-1', '3-c-1-2', '2-b-2-0', '2-b-2-1')
  );

});

const in2: Array<number> = [ 2, 1, 3];
describeObsAsync('concatMap operator (synchronous of asynchronous)', 'should work',
  ToyRx.Observable.from(in2)
    .concatMap((x: number) => ToyRx.Observable.from(letterMap(x), ToyRx.Scheduler.async)),
  RefRx.Observable.from(in2)
    .concatMap((x: number) => RefRx.Observable.from(letterMap(x), RefRx.Scheduler.async)),
  completeEmits('b', 'b', 'a', 'c', 'c', 'c')
);

const in3: Array<number> = [ 1, 2, 3];
describeObsAsync('concatMap operator (asynchronous of asynchronous)', 'should work',
  ToyRx.Observable.from(in3, ToyRx.Scheduler.async)
    .concatMap((x: number) => ToyRx.Observable.from(letterMap(x), ToyRx.Scheduler.async)),
  RefRx.Observable.from(in3, RefRx.Scheduler.async)
    .concatMap((x: number) => RefRx.Observable.from(letterMap(x), RefRx.Scheduler.async)),
  completeEmits('a', 'b', 'b', 'c', 'c', 'c')
);
