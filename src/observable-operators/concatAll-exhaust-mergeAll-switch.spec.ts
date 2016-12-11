import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { completeEmits, describeObsTimedAsync } from '../test-helpers/compare';

/*

First test - (which is degenerate for switch and exhaust)

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
function mkToy1(): ToyRx.Observable<ToyRx.Observable<string>> {
  const toyA: ToyRx.Observable<string> = ToyRx.Observable.interval(70)
    .map((x: number): string => 'A' + x).take(3);
  const toyB: ToyRx.Observable<string> = ToyRx.Observable.interval(100)
    .map((x: number): string => 'B' + x).take(4);
  return ToyRx.Observable.of(toyA, toyB);
}
const ref1A: RefRx.Observable<string> = RefRx.Observable.interval(70)
  .map((x: number): string => 'A' + x).take(3);
const ref1B: RefRx.Observable<string> = RefRx.Observable.interval(100)
  .map((x: number): string => 'B' + x).take(4);

describeObsTimedAsync('mergeAll operator (timed test 1)',  'should work',
  () => mkToy1().concatAll(),
  () => RefRx.Observable.of(ref1A, ref1B).mergeAll(),
  [70, 100, 140, 200, 210, 300, 400, 400],
  completeEmits('A0', 'B0', 'A1', 'B1', 'A2', 'B2', 'B3')
);

describeObsTimedAsync('switch operator (timed test 1)',  'should work',
  () => mkToy1().concatAll(),
  () => RefRx.Observable.of(ref1A, ref1B).switch(),
  [100, 200, 300, 400, 400],
  completeEmits('B0', 'B1', 'B2', 'B3')
);

describeObsTimedAsync('exhaust operator (timed test 1)',  'should work',
  () => mkToy1().concatAll(),
  () => RefRx.Observable.of(ref1A, ref1B).exhaust(),
  [70, 140, 210, 210],
  completeEmits('A0', 'A1', 'A2')
);

describeObsTimedAsync('concatAll operator (timed test 1)',  'should work',
  () => mkToy1().concatAll(),
  () => RefRx.Observable.of(ref1A, ref1B).concatAll(),
  [70, 140, 210, 310, 410, 510, 610, 610],
  completeEmits('A0', 'A1', 'A2', 'B0', 'B1', 'B2', 'B3')
);

/*

Second test - (which shows switching and exhausting)

Time    A       B       C         mergeAll  switch  exhaust  concatAll
0       ^
70      A0                        A0        A0      A0       A0
100             ^
140     A1$                       A1                A1       A1
200             B0                B0        B0               B0@240
250                     ^
300             B1                B1                         B1@340
320                     C0        C0        C0      C0
390                     C1        C1        C1      C1
400             B2$               B2                         B2@440
460                     C2$       C2$       C2$    C2$       C0@510
410                                                          C1@580
510                                                          C2$@650
610

*/

function mkToy2(): ToyRx.Observable<ToyRx.Observable<string>> {
  const toyA: ToyRx.Observable<string> = ToyRx.Observable.interval(70)
    .map((x: number): string => 'A' + x).take(2);
  const toyB: ToyRx.Observable<string> = ToyRx.Observable.interval(100)
    .map((x: number): string => 'B' + x).take(3);
  const toyC: ToyRx.Observable<string> = ToyRx.Observable.interval(70)
    .map((x: number): string => 'C' + x).take(3);
  return new ToyRx.Observable((o: ToyRx.Observer<ToyRx.Observable<string>>) => {
    o.next(toyA);
    setTimeout(() => o.next(toyB), 100);
    setTimeout(() => o.next(toyC), 250);
    setTimeout(() => o.complete(), 500);
  });
}
function mkRef2(): RefRx.Observable<RefRx.Observable<string>> {
  const refA: RefRx.Observable<string> = RefRx.Observable.interval(70)
    .map((x: number): string => 'A' + x).take(2);
  const refB: RefRx.Observable<string> = RefRx.Observable.interval(100)
    .map((x: number): string => 'B' + x).take(3);
  const refC: RefRx.Observable<string> = RefRx.Observable.interval(70)
    .map((x: number): string => 'C' + x).take(3);
  return new RefRx.Observable((o: RefRx.Observer<RefRx.Observable<string>>) => {
    o.next(refA);
    setTimeout(() => o.next(refB), 100);
    setTimeout(() => o.next(refC), 250);
    setTimeout(() => o.complete(), 500);
  });
}

describeObsTimedAsync('mergeAll operator (timed test 2)',  'should work',
  () => mkToy2().concatAll(),
  () => mkRef2().mergeAll(),
  [70, 140, 200, 300, 320, 390, 400, 460, 460],
  completeEmits('A0', 'A1', 'B0', 'B1', 'C0', 'C1', 'B2', 'C2')
);

describeObsTimedAsync('switch operator (timed test 2)',  'should work',
  () => mkToy2().concatAll(),
  () => mkRef2().switch(),
  [70, 200, 320, 390, 460, 460],
  completeEmits('A0', 'B0', 'C0', 'C1', 'C2')
);

describeObsTimedAsync('exhaust operator (timed test 2)',  'should work',
  () => mkToy2().concatAll(),
  () => mkRef2().exhaust(),
  [70, 140, 320, 390, 460, 460],
  completeEmits('A0', 'A1', 'C0', 'C1', 'C2')
);

describeObsTimedAsync('concatAll operator (timed test 2)',  'should work',
  () => mkToy2().concatAll(),
  () => mkRef2().concatAll(),
  [70, 140, 240, 340, 440, 510, 580, 650, 650],
  completeEmits('A0', 'A1', 'B0', 'B1', 'B2', 'C0', 'C1', 'C2')
);
