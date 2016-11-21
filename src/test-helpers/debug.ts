/**
 *
 * Defines a debugging observable
 *
 */

import * as Rx from 'rxjs/Rx';

export class Debug<T> implements Rx.Observer<T> {

  private start: number;

  constructor(private label: string, private done?: () => void) {
    this.start = Date.now();
  }

  // Return milliseconds since created with 0-padding
  private ms(): string {
    let s: string = ((Date.now() - this.start) % 10000).toString();
    while (s.length < 4) {
      s = '0' + s;
    }
    return s;
  }

  next(x: T): void {
    console.log(`${this.label}${this.ms()} next ${x}`);
  }

  error(e: Error): void {
    console.log(`${this.label}${this.ms()} error ${e.message}`);
    if (this.done) {
      this.done();
    }
  }

  complete(): void {
    console.log(`${this.label}${this.ms()} complete`);
    if (this.done) {
      this.done();
    }
  }

}
