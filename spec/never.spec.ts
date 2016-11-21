import { Observable as ToyO }  from '../src/Rx';
import { Observable as RefO } from 'rxjs/Rx';

import { toyRefExp } from './helpers/compare';

describe('Observable.never', () => {

  it('should do nothing', () => {
    toyRefExp(ToyO.never(), RefO.never(), []);
  });

});
