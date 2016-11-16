import * as Rx from 'rxjs/Rx';
import * as ToyRx from '../src/toy-rxjs';

const delay = (ms: number) => (observer: Rx.Observer<string>): void => {
  observer.next('Start');
  setTimeout((): void => {
    observer.next('Trigger');
    observer.complete();
  }, ms);
};

const repeat = (ticks: number, ms: number) => (observer: Rx.Observer<string>): void => {
  let count: number = 0;
  observer.next('start');
  const id: any = setInterval((): void => {
    if (count < ticks) {
      count++;
      observer.next(`tick ${count}`);
    } else {
      clearInterval(id);
      observer.complete();
    }
  }, ms);
};

const forever = (ms: number) => (observer: Rx.Observer<string>): (() => void) => {
  let count: number = 0;
  observer.next('start');
  const id: any = setInterval((): void => {
      observer.next(`tick ${count}`);
  }, ms);
  return (): void => {
    clearInterval(id);
  };
};

// gives the time elapsed in ms rounded to the nearest 10ms
function elapsed(start: Date): number {
  const now: Date = new Date();
  const diff: number = now.getTime() - start.getTime();
  return Math.round(diff / 50) * 50;
}

function createAsyncLoggingObserver<T>(log: string[], label: string, done: DoneFn): Rx.Observer<T> {
  const start: Date = new Date();
  label = label ? label + ' ' : ''; // pad with a space if we have a label
  return {
    next: (x: T): void => { log.push(`${label}${elapsed(start)} next ${x}`); },
    error: (e: Error): void => { log.push(`${label}${elapsed(start)}error ${e.message}`); done(); },
    complete: (): void => { log.push(`${label}${elapsed(start)} complete`); done(); }
  };
}

describe('Observables from an async setTimeout', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    (new ToyRx.Observable<string>(delay(200)))
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
  });

  beforeEach((done: DoneFn) => {
    (new Rx.Observable<string>(delay(200)))
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
  });

  it('should work', () => {
    expect(tlog.length).toBe(3);
    expect(tlog).toEqual(rlog);
  });

});

describe('Observables from a finite async setInterval', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    (new ToyRx.Observable<string>(repeat(5, 100)))
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
  });

  beforeEach((done: DoneFn) => {
    (new Rx.Observable<string>(repeat(5, 100)))
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
  });

  it('should work', () => {
    expect(tlog.length).toBe(7);
    expect(tlog).toEqual(rlog);
  });

});

describe('Observables from an infinite async setInterval using unsubscribe', () => {
  let tlog: string[] = [];
  let rlog: string[] = [];

  beforeEach((done: DoneFn) => {
    let s: ToyRx.Subscription = (new ToyRx.Observable<string>(forever(100)))
      .subscribe(createAsyncLoggingObserver(tlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  beforeEach((done: DoneFn) => {
    let s: Rx.Subscription = (new Rx.Observable<string>(forever(100)))
      .subscribe(createAsyncLoggingObserver(rlog, '', done));
    setTimeout(() => { s.unsubscribe(); done(); } , 450);
  });

  it('should work', () => {
    expect(tlog.length).toBe(5);
    expect(tlog).toEqual(rlog);
  });

});
