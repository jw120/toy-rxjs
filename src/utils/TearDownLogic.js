/**
 *
 * Helper functions used within the library to work with TearDownLogic
 *
 */
"use strict";
// Helper function to extract the unsubscribe function from the TearDownLogic
function extractFn(teardown) {
    if (typeof teardown === 'function') {
        return teardown;
    }
    if (typeof teardown === 'object') {
        let objTeardown = teardown;
        if (objTeardown.unsubscribe !== undefined && typeof objTeardown.unsubscribe === 'function') {
            return objTeardown.unsubscribe;
        }
    }
    return undefined;
}
exports.extractFn = extractFn;
function callTearDownLogic(teardown) {
    let f = extractFn(teardown);
    if (f !== undefined) {
        f();
    }
}
exports.callTearDownLogic = callTearDownLogic;
//# sourceMappingURL=TearDownLogic.js.map