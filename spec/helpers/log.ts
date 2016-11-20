/**
 * Simple module to
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
