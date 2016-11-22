import * as ToyRx from '../Rx';
import * as RefRx from 'rxjs/Rx';

import { itObs } from '../test-helpers/compare';

describe('Observable.never', () => {

  itObs('should do nothing', ToyRx.Observable.never(), RefRx.Observable.never(), []);

});
