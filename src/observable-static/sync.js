"use strict";
const Observable_1 = require("../Observable");
function range(start, count) {
    return new Observable_1.Observable((observer) => {
        for (let i = start; i < start + count; i++) {
            observer.next(i);
        }
        observer.complete();
    });
}
exports.range = range;
//# sourceMappingURL=sync.js.map