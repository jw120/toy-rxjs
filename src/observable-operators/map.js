"use strict";
const Observable_1 = require("../Observable");
// Returns an observable whose values are those of this observable with the project function applied
function map(first, project) {
    return new Observable_1.Observable((o) => first({
        next: (x) => o.next(project(x)),
        error: o.error,
        complete: o.complete
    }));
}
exports.map = map;
//# sourceMappingURL=map.js.map