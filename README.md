# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library. In order to better understand the `magic' within the library,
I started to write my own toy version.

## TODO

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

* empty - done (without Scheduler)
* interval - done (without Scheduler)
* of - done (without Scheduler)
* range - done (without Scheduler)
* throw - done (without Scheduler)
* timer - done (without Scheduler)

* bindCallback - to do, easy
* bindNodeCallback - to do, easy
* fromPromise - to do, easy

* defer - to do, medium
* fromEvent - to do, medium
* fromEventPattern - to do, medium
* from - to do, medium (without Scheduler)

* repeat - needs Scheduler
* repeatWhen - needs Scheduler

* ajax -
* generate - ?

Later
* Scheduler
* Subject