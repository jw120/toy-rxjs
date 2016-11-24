import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { TimedLog, mkTimedLog } from '../test-helpers/timedLog';

describe('Observable.timer operator (asynchronous)', () => {

  let toyLog: TimedLog<number>;
  let refLog: TimedLog<number>;
  let expLog: TimedLog<number> = mkTimedLog([200, 300, 400], ['next 0', 'next 1', 'next 2']);

  it('ToyRx logging (Date delay)', (done: DoneFn) => {
    toyLog = new TimedLog(done);
    let delay: Date = new Date();
    delay.setMilliseconds(delay.getMilliseconds() + 200);
    const toySub: ToyRx.Subscription = ToyRx.Observable.timer(delay, 100)
      .subscribe(toyLog);
    setTimeout(() => { toySub.unsubscribe(); done(); } , 450);
  });

  it('RefRx logging (Date delay)', (done: DoneFn) => {
    refLog = new TimedLog(done);
    let delay: Date = new Date();
    delay.setMilliseconds(delay.getMilliseconds() + 200);
    const refSub: RefRx.Subscription = RefRx.Observable.timer(delay, 100)
      .subscribe(refLog);
    setTimeout(() => { refSub.unsubscribe(); done(); } , 450);
  });

  it('should work with Date delay (ToyRx)', () => {
    expect(refLog).toEqual(expLog);
  });

  it('should work with Date delay (RefRx)', () => {
    expect(toyLog).toEqual(expLog);
  });

});
