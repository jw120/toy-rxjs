"use strict";
const Observable_1 = require("../Observable");
function take(first, n) {
    return new Observable_1.Observable((o) => {
        let count = 0;
        return first({
            next: (x) => {
                if (count++ < n) {
                    o.next(x);
                }
                if (count === n) {
                    o.complete();
                }
            },
            error: o.error,
            complete: o.complete
        });
    });
}
exports.take = take;
//# sourceMappingURL=take.js.map