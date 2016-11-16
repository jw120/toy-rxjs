// .create is an alias for constructor
// .fromEvent

function nop(): void { /* nothing */ }

// An observer is simply a set of callbacks
export interface Observer<T> {
  next: (x: T) => void,
  error?: (e: Error) => void,
  complete?: () => void
}

export interface Subscription<T> {
  unsubscribe: () => void
}

export class Observable<T> {

  private finished: boolean;

  constructor(private createFn: (o: Observer<T>) => void) {
    this.finished = true;
  }

  subscribe(o: Observer<T>): Subscription<T>;
  subscribe(nextFn: (x: T) => void, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription<T>;
  subscribe(a: ((x: T) => void)| Observer<T>, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription<T> {
    this.finished = false;
    let rawObserver: Observer<T>;
    if (typeof a === 'function') {
      rawObserver = {
        next: a,
        error: errorFn || nop,
        complete: completeFn || nop
      };
    } else {
      rawObserver = a;
    }
    const fullObserver = {
      next: (x: T) => { if (!this.finished) { rawObserver.next(x); } },
      error: (e: Error) => { if (!this.finished) { this.finished = true; rawObserver.error(e); } },
      complete: () => { if (!this.finished) { this.finished = true; rawObserver.complete(); } }
    }

    this.createFn(fullObserver);

    return {
      unsubscribe: () => { /* empty */ }
    }

  }

}

