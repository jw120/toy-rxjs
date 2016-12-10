import * as Rx from '../Rx';

describe('Observable.prototype.let', () => {
  it('should be able to compose with let', (done: DoneFn) => {
    const expected: Array<string> = ['aa', 'bb'];
    let i: number = 0;

    function foo(observable: Rx.Observable<string>): Rx.Observable<string> {
      return observable.map((x: string) => x + x);
    }

    Rx.Observable
      .from(['a', 'b'])
      .let(foo)
      .subscribe((x: string) => {
        expect(x).toEqual(expected[i++]);
      }, () => {
        throw new Error('should not be called');
      }, () => {
        done();
      });
  });
});
