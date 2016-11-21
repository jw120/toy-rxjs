import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { compare2Sync, compare2Async } from '../test-helpers/compare';

const e: Error = Error('xyz');

describe('Observable.throw (synchronous)', () => {
  compare2Sync('should work', ToyRx.Observable.throw(e), RefRx.Observable.throw(e), ['error xyz']);
});

describe('Observable.throw (asynchronous)', () => {
  compare2Async('works',
    ToyRx.Observable.throw(e, ToyRx.Scheduler.async),
    RefRx.Observable.throw(e, RefRx.Scheduler.async),
    ['error xyz']
  );
});
