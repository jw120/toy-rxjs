# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library (v5). In order to better understand the `magic' within the library,
I started to write my own toy version to explore the API.

This now implements most of the RxJS API, with the major Simplification
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
* Unsubscribes in concat called in wrong order
* fromPromise does not support unsubscribing before resolution
* cannot double call (multicast) observables like range made with fromIterator
* Improper types for higher-order operators (concat)
* Don't support hot observables

* Problems with typing overloded operators

## TODO

* Tests for mergeAll; implement
* Tests for switch; implement
* Tests for exhaust; implement
* Map versions

* why does fromPromise do nothing for the simple sync cases?
* support thisArg in map and filter?

Tests

* Check take handles excess complete/errors

* Add JSDoc? or at least more comments
* what is the right word to use? emit? message?

* switchMap
* combineLatest?


## Operators

### Creation

Written and tests freshened
* never (scheduler n/a) - done

* create - done (scheduler n/a)
* empty - done (sync and async)
* throw - done (sync only)
* of - done (sync and async)
* interval - done (sync and async- async is default)
* range - done (sync and async)
* timer - done (async only)
* fromPromise - done
* from - done (only some types support Scheduler)


* bindCallback - to do, easy
* bindNodeCallback - to do, easy
* defer - to do, medium
* fromEvent - to do, medium
* fromEventPattern - to do, medium

* repeat - needs Scheduler
* repeatWhen - needs Scheduler

* buffer - interesting
* concatMap
* scan
* switchMap
* pairwise
* partition
* delay
* debounceTime
* first

Later
* Scheduler
* Subject