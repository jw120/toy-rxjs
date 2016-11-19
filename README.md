# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library. In order to better understand the `magic' within the library,
I started to write my own toy version.

## TODO

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

Later
* Scheduler
* Subject