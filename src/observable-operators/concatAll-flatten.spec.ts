import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { flatten } from './concatAll';

import {
 completeEmits, /*, incompleteEmits, */ itObs
//  describeObsAsync, describeObsTimedAsync
} from '../test-helpers/compare';

describe('concatAll operator flatten version', () => {

  const in1: Array<Array<number>> = [ [1, 2, 3], [4, 6], [], [8] ];
  const in1flat: Array<number> = [].concat(...in1);
  const toy1: ToyRx.Observable<ToyRx.Observable<number>> =
    ToyRx.Observable.from(in1.map((xs: Array<number>) => ToyRx.Observable.from(xs)));
  const ref1: RefRx.Observable<RefRx.Observable<number>> =
    RefRx.Observable.from(in1.map((xs: Array<number>) => RefRx.Observable.from(xs)));

  itObs('should work with regular synchronous observables',
    flatten(toy1),
    ref1.concatAll(),
    completeEmits(...in1flat)
  );
});
