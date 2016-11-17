import * as Rx from 'rxjs/Rx';

export function createLoggingObserver<T>(log: string[], label?: string): Rx.Observer<T> {
  label = label ? label + ' ' : ''; // pad with a space if we have a label
  return {
    next: (x: T): void => { log.push(`${label}next ${x}`); },
    error: (e: Error): void => { log.push(`${label}error ${e.message}`); },
    complete: (): void => { log.push(`${label}complete`); }
  };
}

// gives the time elapsed in ms rounded to the nearest 10ms
function elapsed(start: Date): number {
  const now: Date = new Date();
  const diff: number = now.getTime() - start.getTime();
  return Math.round(diff / 50) * 50;
}

export function createAsyncLoggingObserver<T>(log: string[], label: string, done: DoneFn): Rx.Observer<T> {
  const start: Date = new Date();
  label = label ? label + ' ' : ''; // pad with a space if we have a label
  return {
    next: (x: T): void => { log.push(`${label}${elapsed(start)} next ${x}`); },
    error: (e: Error): void => { log.push(`${label}${elapsed(start)}error ${e.message}`); done(); },
    complete: (): void => { log.push(`${label}${elapsed(start)} complete`); done(); }
  };
}

export function createLoggingObserverWithDone<T>(log: string[], done: DoneFn): Rx.Observer<T> {
  return {
    next: (x: T): void => { log.push(`next ${x}`); },
    error: (e: Error): void => { log.push(`error ${e.message}`); done(); },
    complete: (): void => { log.push(`complete`); done(); }
  };
}
