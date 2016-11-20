import * as ToyRx from '../src/Rx';

function asyncObsFromArray(xs: number[], i: number = 0): ToyRx.Observable<number> {
  return new ToyRx.Observable((o: ToyRx.Observer<number>): (() => void) => {
    let id: any = setInterval(() => {
      if (i < xs.length) {
        o.next(i++);
      }
      if (i === xs.length) {
        clearInterval(id);
        id = null;
        o.complete();
      }
    }, 0);
    return () => { if (id) { clearInterval(id); } };
  });
}

function timedLog(s: string): void {
  let now: number = Date.now() % 10000;
  console.log(`${now}: ${s}`);
}

function logObserver(onEnd: () => void): ToyRx.Observer<number> {
  return {
    next: (x: number) => timedLog(`next ${x}`),
    error: (e: Error) => timedLog(`error ${e.message}`),
    complete: () => { timedLog('complete'); onEnd(); }
  };
}

describe('async from array', () => {

  beforeEach((done: DoneFn) => {
    let finished1: boolean = false;
    let finished2: boolean = false;
    asyncObsFromArray([1, 2, 3])
      .subscribe(logObserver(() => {
        finished1 = true;
        if (finished2) { done(); }
      }));
    asyncObsFromArray([4, 5, 6])
      .subscribe(logObserver(() => {
        finished2 = true;
        if (finished1) { done(); }
      }));
  });

  it ('works', (done: DoneFn) => {

    console.log('nothing else');
    done();

  });

});

function two(done: DoneFn, a: ((d: () => void) => void), b: (d: () => void) => void) {
  let finished1: boolean = false;
  let finished2: boolean = false;
  a(() => {
    finished1 = true;
    if (finished2) { done(); }
  });
  b(() => {
    finished2 = true;
    if (finished1) { done(); }
  });
}

describe('async from array with two helper', () => {

  beforeEach((done: DoneFn) => {
    two(done,
      (d1: () => void): void => { asyncObsFromArray([1, 2, 3]).subscribe(logObserver(d1)); },
      (d2: () => void): void => { asyncObsFromArray([4, 5, 6]).subscribe(logObserver(d2)); }
    );
  });

  it ('works', (done: DoneFn) => {

    console.log('nothing else');
    done();

  });

});

// Start the given async functions (which all take done functions which they call at the end)
// and call done when all are completed
function multiple(done: DoneFn, ...asyncFns: Array<((d: () => void) => void)>) {
  let finished: Array<boolean> = asyncFns.map(() => false);
  let countFinished: number = 0;
  asyncFns.forEach((f: (d: () => void) => void, i: number) => {
    f(() => {
      if (!finished[i]) {
        finished[i] = true;
        countFinished++;
        if (countFinished >= asyncFns.length) {
          done();
        }
      }
    });
  });
}

describe('async from array with multiple helper', () => {

  beforeEach((done: DoneFn) => {
    multiple(done,
      (d1: () => void): void => { asyncObsFromArray([1, 2, 3]).subscribe(logObserver(d1)); },
      (d2: () => void): void => { asyncObsFromArray([4, 5, 6]).subscribe(logObserver(d2)); }
    );
  });

  it ('works', (done: DoneFn) => {

    console.log('nothing else');
    done();

  });

});



