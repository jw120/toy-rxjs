import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { describe2AsyncClose } from '../test-helpers/compare';

describe2AsyncClose('Observable.timer operator (asynchronos)', 'should work with a short delay',
  ToyRx.Observable.timer(200, 100).take(3),
  RefRx.Observable.timer(200, 100).take(3),
  [200, 300, 400, 400],
  ['next 0', 'next 1', 'next 2', 'complete'],
  [-10, 25],
);

describe2AsyncClose('Observable.timer operator (asynchronos)', 'should work with a longer delay',
  ToyRx.Observable.timer(500, 100).take(2),
  RefRx.Observable.timer(500, 100).take(2),
  [500, 600, 600],
  ['next 0', 'next 1', 'complete'],
  [-10, 25],
);

describe2AsyncClose('Observable.timer operator (asynchronos)', 'should work with a longer period',
  ToyRx.Observable.timer(200, 150).take(3),
  RefRx.Observable.timer(200, 150).take(3),
  [200, 350, 500, 500],
  ['next 0', 'next 1', 'next 2', 'complete'],
  [-10, 25],
);

describe2AsyncClose('Observable.timer operator (asynchronos)', 'should work without a period',
  ToyRx.Observable.timer(200),
  RefRx.Observable.timer(200),
  [200, 200],
  ['next 0', 'complete'],
  [-10, 25],
);

describe2AsyncClose('Observable.timer operator (asynchronos)', 'should work with a timer',
  ToyRx.Observable.timer(200, 100),
  RefRx.Observable.timer(200, 100),
  [200, 300, 400],
  ['next 0', 'next 1', 'next 2'],
  [-10, 25],
  450
);
