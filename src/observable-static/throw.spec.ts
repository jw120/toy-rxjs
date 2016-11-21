import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { it2Sync, describe2Async } from '../test-helpers/compare';

const e: Error = Error('xyz');

describe('Observable.throw (synchronous)', () => {
  it2Sync('should work', ToyRx.Observable.throw(e), RefRx.Observable.throw(e), ['error xyz']);
});

describe2Async('Observable.throw (asynchronous)', 'works',
  ToyRx.Observable.throw(e, ToyRx.Scheduler.async),
  RefRx.Observable.throw(e, RefRx.Scheduler.async),
  ['error xyz']
);
