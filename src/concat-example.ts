// import * as ToyRx from './Rx';
import * as RefRx from 'rxjs/Rx';

import { Debug } from './test-helpers/debug';

ref();
// toy();

function ref(): void {
  console.log('RefRx')
  const a: RefRx.Observable<string> =
    RefRx.Observable.interval(100).take(3).map((x: number) => `Ref A ${x}`);
  const b: RefRx.Observable<string> =
    RefRx.Observable.interval(150).take(3).map((x: number) => `Ref B ${x}`);
  const c: RefRx.Observable<string> =
    a.concat(b);
  const d: Debug<string> = new Debug('');
  c.subscribe(d);
}

// function toy(): void {
//   console.log('ToyRx')
//   const a: ToyRx.Observable<string> =
//     ToyRx.Observable.interval(100).take(3).map((x: number) => `Toy A ${x}`);
//   const b: ToyRx.Observable<string> =
//     ToyRx.Observable.interval(100).take(3).map((x: number) => `Toy B ${x}`);
//   const c: ToyRx.Observable<string> =
//     a.concat(b);
//   const d: Debug<string> = new Debug('');
//   c.subscribe(d);
// }
