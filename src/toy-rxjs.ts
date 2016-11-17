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

  constructor(private createFn: CreateFn<T>) {
  }

  /**
   *
   * Creation methods
   *
   */

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

  static range(start: number, count: number): Observable<number> {
    return new Observable((observer: Observer<number>): void => {
      for (let i: number = start; i < start + count; i++) {
        observer.next(i);
      }
      observer.complete();
    });
  }

  static interval(period: number): Observable<number> {
    return new Observable((observer: Observer<number>): UnSubFn => {
      let i: number = 0;
      const id: any = setInterval(() => {
        observer.next(i++);
      }, period);
      return (): void => clearInterval(id);
    });
  }

  static throw<T>(e: Error): Observable<T> {
    return new Observable((observer: Observer<T>): void => {
      observer.error(e);
    });
  }

  static empty<T>(): Observable<T> {
    return new Observable((observer: Observer<T>): void => {
      observer.complete();
    });
  }

  static never<T>(): Observable<T> {
    return new Observable((): void => { /* do nothing */ });
  }

  subscribe(o: Observer<T>): Subscription;
  subscribe(nextFn: (x: T) => void, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription;
  subscribe(a: ((x: T) => void)| Observer<T>, errorFn?: (e: Error) => void, completeFn?: () => void): Subscription {
    let rawObserver: Observer<T> = (typeof a === 'object') ? a : {
        next: a,
        error: errorFn || nop,
        complete: completeFn || nop
    };
    let finished: boolean = false;
    const unsub: UnSubFn | void = this.createFn({
      next: (x: T): void => { if (!finished) { rawObserver.next(x); } },
      error: (e: Error): void => { if (!finished) { finished = true; rawObserver.error(e); } },
      complete: (): void => { if (!finished) { finished = true; rawObserver.complete(); } }
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

  map<U>(f: (x: T) => U): Observable<U> {
    return new Observable((o: Observer<U>): (UnSubFn | void) => this.createFn({
      next: (x: T): void => o.next(f(x)),
      error: o.error,
      complete: o.complete
    }));
  }

  concat0(suffix: Observable<T>): Observable<T> {
    return new Observable<T>((o: Observer<T>): (UnSubFn | void) => {
      let firstActive: boolean = true;
      let secondActive: boolean = false;
      this.createFn({
        next: (x: T): void => firstActive && o.next(x),
        error: (e: Error): void  => { if (firstActive) { firstActive = false; o.error(e); } },
        complete: (): void => { if (firstActive) { firstActive = false; secondActive = true; } }
      });
      return suffix.createFn({
        next: (x: T): void => secondActive && o.next(x),
        error: (e: Error): void  => { if (secondActive) { secondActive = false; o.error(e); } },
        complete: (): void => { if (secondActive) { secondActive = false; o.complete(); } }
      });
    });
  }

   concat(suffix: Observable<T>): Observable<T> {
    //  console.log('Concatting');
    return new Observable<T>((o: Observer<T>): (UnSubFn | void) => {
      type Active
        = 'First' // We start off passing through from first observable (while storing second observable)
        | 'Second' // Then we pass through from the second observable
        | 'None'; // Then we are finished
      type QueueItem
        = { type: 'Next', value: T }
        | { type: 'Error', value: Error }
        | { type: 'Complete' };
      let active: Active = 'First';
      let queue: QueueItem[] = [];
      // console.log('First starting');
      this.createFn({
        next: (x: T): void => {
          if (active === 'First') { // Pass if correct mode, otherwise ignore
            // console.log('First next', x);
            o.next(x);
          } else {
            // console.log('First next ignored');
          }
        },
        error: (e: Error): void  => {
          if (active === 'First') { // Flag error and complete if correct mode, otherwise ignore
            // console.log('First error');
            active = 'None';
            o.error(e);
          } else {
            // console.log('First error ignored');
          }
        },
        complete: (): void => {
          if (active === 'First') { // Move to second if active
            // console.log('First complete');
            active = 'Second';
            queue.forEach((q: QueueItem) => {
              if (active === 'Second') {
                switch (q.type) {
                  case 'Next':
                    o.next(q.value);
                    break;
                  case 'Error':
                    o.error(q.value);
                    active = 'None';
                    break;
                  case 'Complete':
                    o.complete();
                    active = 'None';
                    break;
                  default:
                    throw Error('Unknown type in concat dequeuing');
                }
              }
            });
          } else {
            // console.log('First complete ignored', active);
          }
        }
      });
      // console.log('Second starting');
      return suffix.createFn({
        next: (x: T): void => {
          if (active === 'First') { // Store if still on first
            // console.log('Second queued', x);
            queue.push({ type: 'Next', value: x });
          } else if (active === 'Second') { // Pass if on second, otherwise ignore
            // console.log('Second next');
            o.next(x);
          }
        },
        error: (e: Error): void  => {
          if (active === 'First') {
            queue.push({ type: 'Error', value: e});
          } else if (active === 'Second') {
            active = 'None';
            o.error(e);
          }
        },
        complete: (): void => {
          if (active === 'First') {
            queue.push({ type: 'Complete' });
          } else if (active === 'Second') {
            // console.log('Second complete');
            active = 'None';
            o.complete();
          }
        }
      });
    });
  }

  take(n: number): Observable<T> {
    return new Observable<T>((o: Observer<T>): (UnSubFn | void) => {
      let count: number = 0;
      return this.createFn({
        next: (x: T): void => {
          if (count++ < n) {
            o.next(x);
          }
          if (count === n) {
            o.complete();
          }
        },
        error: o.error,
        complete: o.complete
      });
    });
  }

}
