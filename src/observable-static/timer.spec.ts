import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { completeEmits, incompleteEmits, describeObsTimedAsync } from '../test-helpers/compare';

describeObsTimedAsync('Observable.timer operator (asynchronos)', 'should work with a short delay',
  () => ToyRx.Observable.timer(200, 100).take(3),
  () => RefRx.Observable.timer(200, 100).take(3),
  [200, 300, 400, 400],
  completeEmits(0, 1, 2)
);

describeObsTimedAsync('Observable.timer operator (asynchronos)', 'should work with a longer delay',
  () => ToyRx.Observable.timer(500, 100).take(2),
  () => RefRx.Observable.timer(500, 100).take(2),
  [500, 600, 600],
  completeEmits(0, 1)
);

describeObsTimedAsync('Observable.timer operator (asynchronos)', 'should work with a longer period',
  () => ToyRx.Observable.timer(200, 150).take(3),
  () => RefRx.Observable.timer(200, 150).take(3),
  [200, 350, 500, 500],
  completeEmits(0, 1, 2)
);

describeObsTimedAsync('Observable.timer operator (asynchronos)', 'should work without a period',
  () => ToyRx.Observable.timer(200),
  () => RefRx.Observable.timer(200),
  [200, 200],
  completeEmits(0)
);

describeObsTimedAsync('Observable.timer operator (asynchronos)', 'should work with a timer',
  () => ToyRx.Observable.timer(200, 100),
  () => RefRx.Observable.timer(200, 100),
  [200, 300, 400],
  incompleteEmits(0, 1, 2),
  450
);
