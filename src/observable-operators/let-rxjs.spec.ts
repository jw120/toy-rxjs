// import * as Rx from '../Rx';

// describe('Observable.prototype.let', () => {
//   it('should be able to compose with let', (done: DoneFn) => {
//     const expected: string[] = ['aa', 'bb'];
//     let i: number = 0;

//     const foo = (observable: Rx.Observable<string>) => observable.map((x: string) => x + x);

//     Rx.Observable
//       .from(['a', 'b'])
//       .let(foo)
//       .subscribe((x: string) => {
//         expect(x).to.equal(expected[i++]);
//       }, () => {
//         throw new Error('should not be called');
//       }, () => {
//         done();
//       });
//   });
// });
