"use strict";
const Observable_1 = require("../Observable");
// Create an observable that just completes
function empty() {
    return new Observable_1.Observable((observer) => {
        observer.complete();
    });
}
exports.empty = empty;
// Create an observable that does nothing
function never() {
    return new Observable_1.Observable(() => { });
}
exports.never = never;
// Creates a synchronous observable from its arguments
function of(...args) {
    return new Observable_1.Observable((observer) => {
        args.forEach((x) => {
            observer.next(x);
        });
        observer.complete();
    });
}
exports.of = of;
// Creates an observable that just gives an error
function staticThrow(e) {
    return new Observable_1.Observable((observer) => {
        observer.error(e);
    });
}
exports.staticThrow = staticThrow;
//# sourceMappingURL=simple.js.map