## Test Design

Using marble type test syntax borrowed from rxjs. Does not seem to be possible...

### Simple case with cold obersvables

```
const cold1: Observable<string> = cold('--a-b-|');
const cold2: Observable<string> = cold('---c|');
const result: Observable<string> = cold1.concat(cold2);
expect(run(result)).toBe(['--a-bc|');
```

Cold understands '-' for a tick event (do nothing in the scheduler), '|' to complete a stream,
'#' which sends the given error value (or the error "error") and letters which send themselves
or the value from the array. Parentheses are used to show more than one event in the same frame.
```
function cold<T>(template: string, values?: T[], errorValue?: Error): Obsersvable<T>
```

### Hot observables

Hot observables run independently of the subscriptions.
```
const hot1 = hot('----a--^--b-------c--|');
var e2 =     hot(  '---d-^--e---------f-----|');
var expected =          '---(be)----c-f-----|';
```
They add '^' and '!' (one allowed only) to show where the subscription subscribes and unsubscribes.

More realistic example
```
var x = cold(        '--a---b---c--|');
var xsubs =    '------^-------!';
var y = cold(                '---d--e---f---|');
var ysubs =    '--------------^-------------!';
var e1 = hot(  '------x-------y------|', { x: x, y: y });
var expected = '--------a---b----d--e---f---|';

expectObservable(e1.switch()).toBe(expected);
expectSubscriptions(x.subscriptions).toBe(xsubs);
expectSubscriptions(y.subscriptions).toBe(ysubs);
```

## Implementation

Modifiy our test observables so they can be run in ticking mode. They are also normal observables

let x: TickableObservable<string> = cold('ab');
let y: TickableObservable<string> = cold('cd');

which inside looks like

function (o, t) {
  if (t === undefined || t === 0) {
    o.next('a');
  } else if (t === undefined || t === 1) {
    o.next('b'); break;
  } else if (t === 2) {
    o.complete()
  }
}

then saying

let m: Observable<string> = x.map((s) => s + '!');

can be tickRun(m, 3) would work, but

let c: Observable<string> = x.concat(y)

won't




