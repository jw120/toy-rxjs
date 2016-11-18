"use strict";
const Observable_1 = require("../Observable");
// Create an observable that just completes
function interval(period) {
    return new Observable_1.Observable((observer) => {
        let i = 0;
        const id = setInterval(() => {
            observer.next(i++);
        }, period);
        return () => clearInterval(id);
    });
}
exports.interval = interval;
//# sourceMappingURL=async.js.map