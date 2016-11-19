/**
 *
 * Provides subscribe() method for Observer. Ensures that after .complete or .error
 * then no more events are passed and the tear-down logic is called.
 *
 * @param subFn - the subscribe function used to create the Observable
 * @param o - the Observer provided by the user to observe the observable
 */

import { SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';
import { extractFn, NoArgFn } from '../utils/TearDownLogic';

export function subscribe<T>(subFn: SubscribeFn<T>, rawObserver: Observer<T>): Subscription {

  let complete: boolean = false; // set by complete and error
  let tearDown: NoArgFn | undefined = undefined; // set when subFn returns
  let tearDownCalled: boolean = false; // set when we call the teardown

  // Helper function which calls the teardown is we have one and it has not been called already
  function callTearDown(): void {
    if (tearDown && !tearDownCalled) {
      tearDown();
      tearDownCalled = true;
    }
  }

  // Main work is done by wrapping the rawObserver
  let wrappedObserver: Observer<T> = {

      next: (x: T): void => {
        if (!complete) {
          rawObserver.next(x);
        }
      },

      error: (e: Error): void => {
        if (!complete) {
          complete = true;
          rawObserver.error(e);
          callTearDown();
        }
      },

      complete: (): void => {
        if (!complete) {
          complete = true;
          rawObserver.complete();
          callTearDown();
        }
      }
    };

  // Call on our wrapped oberserver, capturing the teardown
  tearDown = extractFn(subFn(wrappedObserver));

  // If we are complete try and call our tearDown in case it has not been called
  // This happens in the synchronous case as tearDown is set after complete is called
  if (complete) {
    callTearDown();
  }

  // Subscription returned has the raw teardown wrapped to avoid multiple calling
  // and closed flag to specify if it has been called already (or would have been called
  // had it existed)
  let sub: Subscription = new Subscription(callTearDown);
  sub.closed = tearDownCalled || complete && tearDown === undefined;
  return sub;

}
