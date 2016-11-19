/**
 *
 * Provides subscribe() method for Observer. Ensures that after .complete or .error
 * then no more events are passed and the tear-down logic is called.
 *
 * @param subFn - the subscribe function used to create the Observable
 * @param o - the Observer provided by the user to observe the observable
 */
"use strict";
const Subscription_1 = require("../Subscription");
const TearDownLogic_1 = require("../utils/TearDownLogic");
function subscribe(subFn, rawObserver) {
    let complete = false; // set by complete and error
    let tearDown = undefined; // set when subFn returns
    let tearDownCalled = false; // set when we call the teardown
    // Helper function which calls the teardown is we have one and it has not been called already
    function callTearDown() {
        console.log('callTearDown entered', !!tearDown, typeof tearDown, tearDownCalled);
        if (tearDown && !tearDownCalled) {
            tearDown();
            console.log('callTearDown calling', !!tearDown, tearDownCalled);
            tearDownCalled = true;
        }
    }
    // Main work is done by wrapping the rawObserver
    let wrappedObserver = {
        next: (x) => {
            if (!complete) {
                rawObserver.next(x);
            }
        },
        error: (e) => {
            if (!complete) {
                complete = true;
                rawObserver.error(e);
                callTearDown();
            }
        },
        complete: () => {
            if (!complete) {
                complete = true;
                rawObserver.complete();
                callTearDown();
            }
        }
    };
    // Call on our wrapped oberserver, capturing the teardown
    tearDown = TearDownLogic_1.extractFn(subFn(wrappedObserver));
    // If we are complete try and call our tearDown in case it has not been called
    // This happens in the synchronous case as tearDown is set after complete is called
    if (complete) {
        callTearDown();
    }
    // Subscription returned has the raw teardown wrapped to avoid multiple calling
    // and closed flag to specify if it has been called already (or would have been called
    // had it existed)
    let sub = new Subscription_1.Subscription(callTearDown);
    sub.closed = tearDownCalled || complete && tearDown === undefined;
    return sub;
}
exports.subscribe = subscribe;
//# sourceMappingURL=subscribe.js.map