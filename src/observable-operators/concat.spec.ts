import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import {
  completeEmits, incompleteEmits, itObs,
  describeObsAsync, describeObsTimedAsync
} from '../test-helpers/compare';
import { Log } from '../test-helpers/log';

describe('concat operator', () => {

  const xs: number[] = [1, 2, 3];
  const ys: number[] = [4, 5];
  itObs('should work with regular synchronous observables',
    ToyRx.Observable.of(...xs).concat(ToyRx.Observable.of(...ys)),
    RefRx.Observable.of(...xs).concat(RefRx.Observable.of(...ys)),
    completeEmits(...(xs.concat(ys)))
  );

  function f1(o: RefRx.Observer<number>): void {
    o.next(1);
    o.next(2);
    o.complete();
    o.next(5);
  }
  function f2(o: RefRx.Observer<number>): void {
    o.next(3);
    o.complete();
    o.next(4);
  }
  itObs('should work with synchronous observables where streams continues after completion',
    ToyRx.Observable.create(f1).concat(ToyRx.Observable.create(f2)),
    RefRx.Observable.create(f1).concat(RefRx.Observable.create(f2)),
    completeEmits(1, 2, 3)
  );

  function f3(o: RefRx.Observer<number>): void {
    o.next(7);
    o.next(8);
  }
  function f4(o: RefRx.Observer<number>): void {
    o.next(9);
    o.next(10);
  }
  itObs('should work with synchronous observables where streams do not complete',
    ToyRx.Observable.create(f3).concat(ToyRx.Observable.create(f4)),
    RefRx.Observable.create(f3).concat(RefRx.Observable.create(f4)),
    incompleteEmits(7, 8)
  );

  function f5(o: RefRx.Observer<number>): void {
    o.next(1);
    o.next(2);
    o.error(Error('fail!'));
    o.error(Error('extraneous fail'));
    o.complete();
    o.next(5);
  }
  function f6(o: RefRx.Observer<number>): void {
    o.next(3);
    o.complete();
    o.next(4);
    o.error(Error('Cannot be reached'));
  }
  itObs('should work with synchronous observables where first stream ends in an error',
    ToyRx.Observable.create(f5).concat(ToyRx.Observable.create(f6)),
    RefRx.Observable.create(f5).concat(RefRx.Observable.create(f6)),
    ['next 1', 'next 2', 'error fail!']
  );

  function f7(log: Log<number>): (obs: RefRx.Observer<number>) => (() => void) {
    return (observer: RefRx.Observer<number>) => {
      observer.next(3);
      observer.complete();
      return () => { log.add('unsub1'); };
    };
  }
  function f8(log: Log<number>): (obs: RefRx.Observer<number>) => (() => void) {
    return (observer: RefRx.Observer<number>) => {
      observer.next(4);
      observer.complete();
      return () => { log.add('unsub2'); };
    };
  }
  // LIMITATION - concat has wrong unsubscribe order
  // would like test below to work without .sort()
  it('should handle unsubscribes (though perhaps not in order)', () => {
    let toyLog: Log<number> = new Log();
    let refLog: Log<number> = new Log();
    let toySub: ToyRx.Subscription =
      ToyRx.Observable.create(f7(toyLog))
      .concat(ToyRx.Observable.create(f8(toyLog)))
      .subscribe(toyLog);
    let refSub: RefRx.Subscription =
      RefRx.Observable.create(f7(refLog))
      .concat(RefRx.Observable.create(f8(refLog)))
      .subscribe(refLog);
    expect(toyLog.log.sort()).toEqual(['next 3', 'unsub1', 'next 4', 'unsub2', 'complete'].sort());
    expect(toyLog.log.sort()).toEqual(refLog.log.sort());
    expect(toySub.closed).toBe(true);
    expect(refSub.closed).toBe(true);
  });

});

describe('concat operator', () => {

  // LIMITATION: Cannot replay observables made with fromIterator
  // const o1: ToyRx.Observable<number> = ToyRx.Observable.range(1, 3);
  // const o2: RefRx.Observable<number> = RefRx.Observable.range(1, 3);
  // itObs('should work with itself with range',
  //   o1.concat(o1),
  //   o2.concat(o2),
  //   completeEmits(1, 2, 3, 1, 2, 3)
  // );

  const o3: ToyRx.Observable<number> = ToyRx.Observable.create((o: ToyRx.Observer<number>): void => {
    o.next(1);
    o.next(2);
    o.complete();
  });
  const o4: RefRx.Observable<number> = RefRx.Observable.create((o: RefRx.Observer<number>): void => {
    o.next(1);
    o.next(2);
    o.complete();
  });
  itObs('should work with itself with create',
    o3.concat(o3),
    o4.concat(o4),
    completeEmits(1, 2, 1, 2)
  );

});

describeObsAsync('concat operator', 'works asynchronously',
  ToyRx.Observable.of(1, 2, 3, ToyRx.Scheduler.async)
    .concat(ToyRx.Observable.of(4, 5, ToyRx.Scheduler.async)),
  RefRx.Observable.of(1, 2, 3, RefRx.Scheduler.async)
    .concat(RefRx.Observable.of(4, 5, RefRx.Scheduler.async)),
  completeEmits(1, 2, 3, 4, 5)
);

describeObsAsync('concat operator', 'works asynchronously with interval/take',
  ToyRx.Observable.interval(100).take(3)
    .concat(ToyRx.Observable.interval(150).take(2)),
  RefRx.Observable.interval(100).take(3)
    .concat(RefRx.Observable.interval(150).take(2)),
  completeEmits(0, 1, 2, 0, 1)
);

describeObsTimedAsync('concat operator', 'works asynchronously with interval/take to time (example 1)',
  () => ToyRx.Observable.interval(100).take(3)
    .concat(ToyRx.Observable.interval(150).take(2)),
  () => RefRx.Observable.interval(100).take(3)
    .concat(RefRx.Observable.interval(150).take(2)),
  [100, 200, 300, 450, 600, 600],
  completeEmits(0, 1, 2, 0, 1)
);

describeObsTimedAsync('concat operator', 'works asynchronously with interval/take to time (example 2)',
  () => ToyRx.Observable.interval(100).take(2)
    .concat(ToyRx.Observable.interval(200).take(3)),
  () => RefRx.Observable.interval(100).take(2)
    .concat(RefRx.Observable.interval(200).take(3)),
  [100, 200, 400, 600, 800, 800],
  completeEmits(0, 1, 0, 1, 2)
);
