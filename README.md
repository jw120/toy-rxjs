# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library. In order to better understand the `magic' within the library,
I started to write my own toy version.

Major simplifications:
* No scheduler. All observable are either created by...

Note - no schedulers used for timer and fromPromise

## TODO

* Next - tests for iterators
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

* create - done
* never - done
* empty - done
* of - done
* throw - done
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