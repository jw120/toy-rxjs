/**
 *
 * Defines a logging observable for use in testing
 *
 */

import * as Rx from 'rxjs/Rx';

export class Log<T> implements Rx.Observer<T> {

  private _log: string[] = [];

  constructor(private done?: () => void) { /* empty */ }

  next(x: T): void {
    this._log.push(`next ${x}`);
  }

  error(e: Error): void {
    this._log.push(`error ${e.message}`);
    if (this.done) {
      this.done();
    }
  }

  complete(): void {
    this._log.push(`complete`);
    if (this.done) {
      this.done();
    }
  }

  get log(): string[] {
    return this._log;
  }

}

interface TimedLogEntry {
  time: number;
  value: string;
}

export class TimedLog<T> implements Rx.Observer<T> {

  private _log: TimedLogEntry[] = [];
  private start: number;

  constructor(private done?: () => void) {
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

  isCloseTo(times: number[], values: string[], tolerance: [number, number]): boolean {
    let val: boolean = this._log.length === times.length &&
      this._log.length === values.length &&
      this._log.every((entry: TimedLogEntry, i: number) => {
        return entry.time > times[i] + tolerance[0] &&
          entry.time < times[i] + tolerance[1] &&
          entry.value === entry.value;
      });
    if (!val) {
      console.log('Failed comparing', this._log, times, values, tolerance);
    }
    return val;
  }

}
