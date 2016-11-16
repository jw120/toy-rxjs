import * as ToyRx from '../src/toy-rxjs';
import * as Rx from 'rxjs/Rx';

export function createLoggingObserver<T>(log: string[], label?: string): Rx.Observer<T> {
  label = label ? label + ' ' : ''; // pad with a space if we have a label
  return {
    next: (x: T): void => { log.push(`${label}next ${x}`); },
    error: (e: Error): void => { log.push(`${label}error ${e.message}`); },
    complete: (): void => { log.push(`${label}complete`); }
  };
}

// create two observables (from rxjs and the toy library) from the given creation function
export function runTwo<T>(c: (o: Rx.Observer<T>) => void): [string[], string[]] {
  const t: ToyRx.Observable<T> = new ToyRx.Observable<T>(c);
  const r: Rx.Observable<T> = new Rx.Observable<T>(c);
  let tlog: string[] = [];
  let rlog: string[] = [];
  t.subscribe(createLoggingObserver(tlog));
  r.subscribe(createLoggingObserver(rlog));
  return [tlog, rlog];
}

// create two observables (from rxjs and the toy library) from the given creation function
// and run with two subscribers
export function runTwoDouble<T>(c: (o: Rx.Observer<T>) => void): [string[], string[]] {
  const t: ToyRx.Observable<T> = new ToyRx.Observable<T>(c);
  const r: Rx.Observable<T> = new Rx.Observable<T>(c);
  let tlog: string[] = [];
  let rlog: string[] = [];
  t.subscribe(createLoggingObserver(tlog, 'A'));
  t.subscribe(createLoggingObserver(tlog, 'B'));
  r.subscribe(createLoggingObserver(rlog, 'A'));
  r.subscribe(createLoggingObserver(rlog, 'B'));
  return [tlog, rlog];
}

// create two observables (from rxjs and the toy library) from the given creation function
// and use the functional form of subscribe
export function runTwoFn<T>(c: (o: Rx.Observer<T>) => void): [string[], string[]] {
  const t: ToyRx.Observable<T> = new ToyRx.Observable<T>(c);
  const r: Rx.Observable<T> = new Rx.Observable<T>(c);
  let tlog: string[] = [];
  let rlog: string[] = [];
  t.subscribe(
      (x: T) => tlog.push('next ' + x),
      (e: Error) => tlog.push('error', e.message),
      () => tlog.push('complete')
  );
  r.subscribe(
      (x: T) => rlog.push('next ' + x),
      (e: Error) => rlog.push('error', e.message),
      () => rlog.push('complete')
  );
  return [rlog, rlog];
}
