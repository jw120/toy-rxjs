import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { it2Sync } from '../test-helpers/compare';

describe('Observable.never', () => {

  it2Sync('should do nothing', ToyRx.Observable.never(), RefRx.Observable.never(), []);

});
