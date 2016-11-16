// .create is an alias for constructor
// .fromEvent

function nop(): void { /* nothing */ }

// An observer is simply a set of callbacks
export interface Observer<T> {
  next: (x: T) => void;
  error?: (e: Error) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe: () => void;
}

type UnSubFn = () => void;
type CreateFn<T> = (o: Observer<T>) => (UnSubFn | void);

export class Observable<T> {

  private finished: boolean;

  constructor(private createFn: CreateFn<T>) {
    this.finished = true;
  }

  subscribe(o: Observer<T>): Subscription;
  subscribe(nextFn: (x: T) => void, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription;
  subscribe(a: ((x: T) => void)| Observer<T>, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription {
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
    const unsub: UnSubFn | void = this.createFn({
      next: (x: T): void => { if (!this.finished) { rawObserver.next(x); } },
      error: (e: Error): void => { if (!this.finished) { this.finished = true; rawObserver.error(e); } },
      complete: (): void => { if (!this.finished) { this.finished = true; rawObserver.complete(); } }
    });

    return {
      unsubscribe: unsub || null
    };

  }

}
