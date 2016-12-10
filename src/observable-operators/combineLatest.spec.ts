import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {  completeEmits, errorEmits, itObs, describeObsAsync } from '../test-helpers/compare';

const toy1a: ToyRx.Observable<number> = ToyRx.Observable.interval(100).take(3);
const toy1b: ToyRx.Observable<number> = ToyRx.Observable.interval(70).take(4);
const ref1a: RefRx.Observable<number> = RefRx.Observable.interval(100).take(3);
const ref1b: RefRx.Observable<number> = RefRx.Observable.interval(70).take(4);
// Time   Obs1    Obs2    combineLatest
// 70             0
// 100    0               0,0
// 140            1       0,1
// 200    1               1,1
// 210            2       1,2
// 280            3       1,3
// 300    2               2,3
describeObsAsync('combineLatest operator (asynchronous)', 'should work',
  toy1a.combineLatest(toy1b),
  ref1a.combineLatest(ref1b),
  completeEmits([0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 3])
);

const toy2a: ToyRx.Observable<number> = ToyRx.Observable.interval(100).take(3);
const toy2b: ToyRx.Observable<number> = ToyRx.Observable.interval(70).take(4);
const ref2a: RefRx.Observable<number> = RefRx.Observable.interval(100).take(3);
const ref2b: RefRx.Observable<number> = RefRx.Observable.interval(70).take(4);
function project(a: number, b: number): string { return `${a}-${b}`; }
describeObsAsync('combineLatest operator (asynchronous)', 'should work with project',
  toy2a.combineLatest(toy2b, project),
  ref2a.combineLatest(ref2b, project),
  completeEmits('0-0', '0-1', '1-1', '1-2', '1-3', '2-3')
);
