# Toy RxJs library

Starting to use Angular 2, I began to make heavy use of Observables from
the RxJs library. In order to better understand the `magic' within the library,
I started to write my own toy version.

TODO

* Subscription
  - Separate out TearDownLogic
  - Make concat work with teardown for both sync and async
* Add JSDoc? or at least more comments
* What should take do with excess completes and errors?
* Rethink time stamps in async logging
* Use tests from rxjs
* Move to github

* timer
* flatMap/concatMap
* switchMap
* combineLatest?

Later
* Scheduler
* Subject