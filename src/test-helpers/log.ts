/**
 *
 * Defines logging observables for use in testing
 *
 */

import * as Rx from 'rxjs/Rx';

/** Basic logging observer for use with synchronous or asynchronous observables */
export class Log<T> implements Rx.Observer<T> {

  private _log: string[] = [];

  constructor(private done?: () => void) { /* empty */ }

  add(s: string): void {
    this._log.push(s);
  }

  next(x: T): void {
    this.add(`next ${x}`);
  }

  error(e: Error): void {
    this.add(`error ${e.message}`);
    if (this.done) {
      this.done();
    }
  }

  complete(): void {
    this.add('complete');
    if (this.done) {
      this.done();
    }
  }

  get log(): string[] {
    return this._log;
  }

}

export interface TimedLogEntry {
  time: number;
  value: string;
}

/** Logging observer that tracks times forevents for use with asynchronous observables */
export class TimedLog<T> implements Rx.Observer<T> {

  _log: TimedLogEntry[] = [];
  start: number;

  constructor(private done: () => void) {
    this.start = Date.now();
  }

  next(x: T): void {
    this._log.push({ time: Date.now() - this.start, value: 'next ' + x });
  }

  error(e: Error): void {
    this._log.push({ time: Date.now() - this.start, value: 'error ' + e.message });
    if (this.done) {
      this.done();
    }
  }

  complete(): void {
    this._log.push({ time: Date.now() - this.start, value: 'complete' });
    if (this.done) {
      this.done();
    }
  }

}

/** Helper function used in compare to construct a TimedLog */
export function mkTimedLog<T>(times: number[], values: string[]): TimedLog<T> {
  let t: TimedLog<T> = new TimedLog(null);
  if (times.length !== values.length) {
    throw Error('Invalid input to mkTimedLog to (mismatched lengths)');
  }
  t._log = times.map((time: number, i: number) => ({
    time,
    value: values[i]
  }));
  return t;
}
