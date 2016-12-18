# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library (v5). In order to better understand the library,
I took a detour and wrote my own toy RxJs library in TypeScript to explore the API, focusing
on the operators used in my Angular app.

This now implements a substantial part of the RxJS API, with many minor ommisions
and the major Simplification
that there is no real scheduler. All observables run as JavaScript functions
(as if passed to Observer.create). A value of `Scheduler.async` can be used
to make creation methods (like `Obserable.of`) produce an asynchronous
Observable by using the node `setInterval` function, but this is just
a flag and there is no functional `Scheduler` class (to provide
a sense of time and to schedule actions). This also means we do not
have the nice marble testing from `RxJs`.

For all of our tests we compare the result from our toy implementation with
the expected result and with the result from running with the full Rxjs library.

Other limitations (see tests labelled 'LIMITATION')

* Patchy handling of teardowns and unsubscribes (e.g., in `concat` called in wrong order, in `fromPromise` cannot unsubscribe before resolution)
* Cannot double call (multicast) observables (like`range`) made with `fromIterator`
* All operators implemented as TypeScript/ES6 class methods (not the hack used by RxJs). This means accepted simplified types
for higher-order operators (as far as I can tell TypeScript does not give a way to write the proper type for, e.g., `concatAll` as a method)
* No support for hot observables

## TODO

* Map versions - finish imp, tests
* Add JSDoc? or at least more comments


## API supported

* `Observer`
* `Scheduler` (with the major limitations listed below)
* `Subcription`
* `Observable` with the following methods:

  + Fundamental: create, subscribe
  + Combining: concat, combineLatest
  + Factory: create, empty, from, fromPromise, interval, never, of, range, throw,timer
  + Flattening: concatAll, exhaust, mergeAll, switch
  + Functional: filter, map, reduce,scan, take
  + Map-and-flatten: concatMap, exhaustMap, mergeMap, switchMap
  + Utility: count, let

