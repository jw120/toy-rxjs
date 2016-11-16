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

  static create<T>(createFn: CreateFn<T>): Observable<T> {
    return new Observable(createFn);
  }

  static of<T>(...args: T[]): Observable<T> {
    return new Observable((observer: Observer<T>): void => {
      args.forEach((x: T) => {
        observer.next(x);
      });
      observer.complete();
    });
  }

  static empty<T>(): Observable<T> {
    return new Observable((observer: Observer<T>): void => {
      observer.complete();
    });
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

  /**
   *
   * Operators
   *
   */

  // take(n: number): Observable<T> {
  //   return new Observable<T>((observer: Observer<T>) => {

  map<U>(f: (x: T) => U): Observable<U> {
    return new Observable((o: Observer<U>) => {
      const oPatched: Observer<T> = {
        next: (x: T) => o.next(f(x)),
        error: o.error,
        complete: o.complete
      };
      return this.createFn(oPatched);
    });
  }

  // identity(): Observable<T> {
  //   return new Observable((o: Observer<T>) => {
  //     return this.createFn(o);
  //   };
  // }



}
