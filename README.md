# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library (v5). In order to better understand the `magic' within the library,
I started to write my own toy version to explore the API.

This now implements most of the RxJS API, with the major Simplification
that there is no real scheduler. All observables run as JavaScript functions
(as if passed to Observer.create). A value of `Scheduler.async` can be used
to make creation methods (like `Obserable.of`) produce an asynchronous
Observable by using the node `setInterval` function, but there is no functional
`Scheduler` class. This also means we do not have the nice marble testing
from `RxJs`.

For all of our tests we compare the result from our toy implementation with
the expected result and with the result from running with the full Rxjs library.

## TODO

* Next - finish tests
* Todo - finish basic creation set - around fromIterable. Simpligy tests. Refactor test files.
* async-helper-spec.ts looks promising. Is there sugar for the done-handling? Add this type of async to our creators?
can we use logging version that captures [time, message] pairs?

Either
 * Seems like tno - Can we do Scheuler null/async and testscheduler keeping a function as the main driver.
    Can we make a helper function to turn a synchronous? How does ngrx schedule a raw create() function?
  * Or implement the operators we use in ng code
Maybe have an Async parameter? (boolean or global constant) and write our own expectObservable
What are hot vs cold?
Simplification - only cold
Simplicication - limited scheduling

expectObervable
x -> value (we implement against an array?)
| -> complete
- -> time??
^
!

Tests

* Check concat calls teardowns properly in async case
* Check take handles excess complete/errors
* Use rxjs tests
* Rethink time stamps test

* Add JSDoc? or at least more comments

* timer
* flatMap/concatMap
* switchMap
* combineLatest?

## Operators

### Creation

Written and tests freshened
* create - done
* never - done
* empty - done (with async)
* throw - done

Tests to freshened
of
range
interval
timer
map
take
interval-take
concat
unsubsribe

* of - done
* interval - done
* range - done
* timer - done
* fromPromise - to do, easy

* from - to do, medium (without Scheduler)


* bindCallback - to do, easy
* bindNodeCallback - to do, easy

* defer - to do, medium
* fromEvent - to do, medium
* fromEventPattern - to do, medium

* repeat - needs Scheduler
* repeatWhen - needs Scheduler

* ajax -
* generate - ?

Later
* Scheduler
* Subject