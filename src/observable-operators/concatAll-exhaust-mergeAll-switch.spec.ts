import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { completeEmits, describeObsTimedAsync } from '../test-helpers/compare';

/*

First test - degenerate for switch and exhaust

Time    A       B       mergeAll  concatAll switch  exhaust
0       ^       ^
70      A0              A0        A0                A0
100             B0      B0                  B0
140     A1              A1        A1                A1
200             B1      B1                  B1
210     A2$             A2        A2                A2$
300             B2      B2                  B2
310                               B0
400             B3$     B3$                 B3$
410                               B1
510                               B2
610                               B3$

*/

// We can't reuse our toy iterator observables, so we re-create for each test
function mkToyAB(): ToyRx.Observable<ToyRx.Observable<string>> {
  const toyA: ToyRx.Observable<string> = ToyRx.Observable.interval(70)
    .map((x: number): string => 'A' + x).take(3);
  const toyB: ToyRx.Observable<string> = ToyRx.Observable.interval(100)
    .map((x: number): string => 'B' + x).take(4);
  return ToyRx.Observable.of(toyA, toyB);
}
const refA: RefRx.Observable<string> = RefRx.Observable.interval(70)
  .map((x: number): string => 'A' + x).take(3);
const refB: RefRx.Observable<string> = RefRx.Observable.interval(100)
  .map((x: number): string => 'B' + x).take(4);

describeObsTimedAsync('mergeAll operator (timed test 1)',  'should work',
  () => mkToyAB().concatAll(),
  () => RefRx.Observable.of(refA, refB).mergeAll(),
  [70, 100, 140, 200, 210, 300, 400, 400],
  completeEmits('A0', 'B0', 'A1', 'B1', 'A2', 'B2', 'B3')
);

describeObsTimedAsync('concatAll operator (timed test 1)',  'should work',
  () => mkToyAB().concatAll(),
  () => RefRx.Observable.of(refA, refB).concatAll(),
  [70, 140, 210, 310, 410, 510, 610, 610],
  completeEmits('A0', 'A1', 'A2', 'B0', 'B1', 'B2', 'B3')
);

describeObsTimedAsync('switch operator (timed test 1)',  'should work',
  () => mkToyAB().concatAll(),
  () => RefRx.Observable.of(refA, refB).switch(),
  [100, 200, 300, 400, 400],
  completeEmits('B0', 'B1', 'B2', 'B3')
);

describeObsTimedAsync('exhaust operator (timed test 1)',  'should work',
  () => mkToyAB().concatAll(),
  () => RefRx.Observable.of(refA, refB).exhaust(),
  [70, 140, 210, 210],
  completeEmits('A0', 'A1', 'A2')
);
