import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { itObs, describeObsAsync } from '../test-helpers/compare';

const e: Error = Error('xyz');

describe('Observable.throw (synchronous)', () => {
  itObs('should work', ToyRx.Observable.throw(e), RefRx.Observable.throw(e), ['error xyz']);
});

describeObsAsync('Observable.throw (asynchronous)', 'works',
  ToyRx.Observable.throw(e, ToyRx.Scheduler.async),
  RefRx.Observable.throw(e, RefRx.Scheduler.async),
  ['error xyz']
);
