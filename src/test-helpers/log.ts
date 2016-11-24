/**
 *
 * Defines logging observable for use in testing
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
