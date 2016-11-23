/**
 *
 * Provides subscribe() method for Observer. Ensures that after .complete or .error
 * then no more events are passed and the tear-down logic is called.
 *
 * @param subFn - the subscribe function used to create the Observable
 * @param rawObserver - the Observer provided by the user to observe the observable
 * @param completionCallback - if this exists it is called instead of rawObserver.complete()
 * (this is used by concat, but is not part of the Observer.subscribe API)
 */

import { SubscribeFn } from '../Observable';
import { Observer } from '../Observer';
import { Subscription } from '../Subscription';
import { extractFn, NoArgFn } from '../utils/TearDownLogic';

export function subscribe<T>(
  subFn: SubscribeFn<T>,
  rawObserver: Observer<T>,
  completionCallback?: () => void): Subscription {

  let complete: boolean = false; // set by complete and error
  let tearDown: NoArgFn | undefined = undefined; // set when subFn returns

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
        if (tearDown) {
          tearDown();
        }
      }
    },
    complete: (): void => {
      if (!complete) {
        complete = true;
        if (tearDown) {
          tearDown();
        }
        if (completionCallback) {
          completionCallback();
        } else {
          rawObserver.complete();
        }
      }
    }
  };

  // Call on our wrapped oberserver, capturing the teardown
  tearDown = extractFn(subFn(wrappedObserver));

  // If we are complete try and call our tearDown in case it has not been called
  // This happens in the synchronous case as tearDown is set after complete is called
  if (complete && tearDown) {
    tearDown();
  }

  let sub: Subscription = new Subscription(tearDown);
  sub.closed = complete;
  return sub;

}
