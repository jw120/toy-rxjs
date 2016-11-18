import * as ToyRx from '../src/Rx';
import * as Rx from 'rxjs/Rx';

describe('unsubscribe', () => {

  it('Should work with no return value', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    let tsub: ToyRx.Subscription =
      ToyRx.Observable.create((o: Rx.Observer<number>) => {
        o.next(9);
        o.complete();
      })
      .subscribe((x: number) => tlog.push(`next ${x}`));
    let rsub: Rx.Subscription =
      Rx.Observable.create((o: Rx.Observer<number>) => {
        o.next(9);
        o.complete();
      })
      .subscribe((x: number) => rlog.push(`next ${x}`));
    expect(tlog).toEqual(['next 9']);
    expect(tlog).toEqual(rlog);
    expect(tsub.closed).toBe(true);
    expect(rsub.closed).toBe(true);
    tsub.unsubscribe(); // these should do nothing
    rsub.unsubscribe();
  });

  it('Should work with a function return value, triggering on complete', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    let tsub: ToyRx.Subscription =
      ToyRx.Observable.create((o: Rx.Observer<number>) => {
        o.next(0);
        o.complete();
        return () => { tlog.push('unsub'); };
      })
      .subscribe((x: number) => tlog.push(`next ${x}`));
    let rsub: Rx.Subscription =
      Rx.Observable.create((o: Rx.Observer<number>) => {
        o.next(0);
        o.complete();
        return () => { rlog.push('unsub'); };
      })
      .subscribe((x: number) => rlog.push(`next ${x}`));
    expect(tlog).toEqual(['next 0', 'unsub']);
    expect(tlog).toEqual(rlog);
    expect(tsub.closed).toBe(true);
    expect(rsub.closed).toBe(true);
  });

  it('Should work with a function return value, triggering on error', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.create((o: Rx.Observer<number>) => {
      o.next(1);
      o.error(Error('err!'));
      return () => { tlog.push('unsub'); };
    })
      .subscribe((x: number) => tlog.push(`next ${x}`), (e: Error) => tlog.push(`error ${e.message}`));
    Rx.Observable.create((o: Rx.Observer<number>) => {
      o.next(1);
      o.error(Error('err!'));
      return () => { rlog.push('unsub'); };
    })
      .subscribe((x: number) => rlog.push(`next ${x}`), (e: Error) => rlog.push(`error ${e.message}`));
    expect(tlog).toEqual(['next 1', 'error err!', 'unsub']);
    expect(tlog).toEqual(rlog);
  });

  it('Should work with a function return value, triggering with explicit unsubscribe', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    let tsub: ToyRx.Subscription = ToyRx.Observable.create((o: Rx.Observer<number>) => {
      o.next(2);
      return () => { tlog.push('unsub'); };
    })
      .subscribe((x: number) => tlog.push(`next ${x}`));
    let rsub: Rx.Subscription = Rx.Observable.create((o: Rx.Observer<number>) => {
      o.next(2);
      return () => { rlog.push('unsub'); };
    })
      .subscribe((x: number) => rlog.push(`next ${x}`));
    expect(tlog).toEqual(['next 2']);
    expect(tlog).toEqual(rlog);
    tsub.unsubscribe();
    rsub.unsubscribe();
    expect(tlog).toEqual(['next 2', 'unsub']);
    expect(tlog).toEqual(rlog);
  });

  it('Should work with a function return value, triggering once with both complete and explicit unsubscribe', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    let tsub: ToyRx.Subscription = ToyRx.Observable.create((o: Rx.Observer<number>) => {
      o.next(3);
      o.complete();
      return () => { tlog.push('unsub'); };
    })
      .subscribe((x: number) => tlog.push(`next ${x}`));
    let rsub: Rx.Subscription = Rx.Observable.create((o: Rx.Observer<number>) => {
      o.next(3);
      o.complete();
      return () => { rlog.push('unsub'); };
    })
      .subscribe((x: number) => rlog.push(`next ${x}`));
    expect(tlog).toEqual(['next 3', 'unsub']);
    expect(tlog).toEqual(rlog);
    expect(tsub.closed).toBe(true);
    expect(rsub.closed).toBe(true);
    tsub.unsubscribe();
    rsub.unsubscribe();
    expect(tlog).toEqual(['next 3', 'unsub']);
    expect(tlog).toEqual(rlog);
  });

  it('Should work with an object return value', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.create((o: Rx.Observer<number>) => {
      o.next(1);
      o.complete();
      return { unsubscribe: () => { tlog.push('unsub'); } };
    })
      .subscribe((x: number) => tlog.push(`next ${x}`));
    Rx.Observable.create((o: Rx.Observer<number>) => {
      o.next(1);
      o.complete();
      return { unsubscribe: () => { rlog.push('unsub'); } };
    })
      .subscribe((x: number) => rlog.push(`next ${x}`));
    expect(tlog).toEqual(['next 1', 'unsub']);
    expect(tlog).toEqual(rlog);
  });

  it('Should work with concat', () => {
    let tlog: string[] = [];
    let rlog: string[] = [];
    ToyRx.Observable.create((o: Rx.Observer<number>) => {
      o.next(3);
      o.complete();
      return { unsubscribe: () => { tlog.push('unsub a'); } };
    })
      .concat(ToyRx.Observable.create((o: Rx.Observer<number>) => {
        o.next(4);
        o.complete();
        return { unsubscribe: () => { tlog.push('unsub b'); } };
      }))
      .subscribe((x: number) => tlog.push(`next ${x}`));
    Rx.Observable.create((o: Rx.Observer<number>) => {
      o.next(3);
      o.complete();
      return { unsubscribe: () => { rlog.push('unsub a'); } };
    })
      .concat(Rx.Observable.create((o: Rx.Observer<number>) => {
        o.next(4);
        o.complete();
        return { unsubscribe: () => { rlog.push('unsub b'); } };
      }))
      .subscribe((x: number) => rlog.push(`next ${x}`));
    expect(tlog).toEqual(['next 3', 'unsub a', 'next 4', 'unsub b']);
    expect(tlog).toEqual(rlog);
  });

});
