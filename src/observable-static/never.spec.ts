import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { compare2Sync } from '../test-helpers/compare';

describe('Observable.never', () => {

  compare2Sync('should do nothing', ToyRx.Observable.never(), RefRx.Observable.never(), []);

});
