"use strict";
const Observable_1 = require("../Observable");
const TearDownLogic_1 = require("../utils/TearDownLogic");
function concat(first, second) {
    return new Observable_1.Observable((o) => {
        let state = { state: 'First' };
        let queue = [];
        let firstTearDown = first(patchFirstObserver(o, state, queue));
        let secondTearDown = second(patchSecondObserver(o, state, queue));
        return () => {
            TearDownLogic_1.callTearDownLogic(firstTearDown);
            TearDownLogic_1.callTearDownLogic(secondTearDown);
        };
    });
}
exports.concat = concat;
function patchFirstObserver(o, state, queue) {
    return {
        // If first still active, just pass on values - otherwise ignore
        next: (x) => (state.state === 'First') && o.next(x),
        // If first still active, error is passed on and stops
        error: (e) => { if (state.state === 'First') {
            state.state = 'None';
            o.error(e);
        } },
        // If first still active, complete makes second observable active and first empties the queue
        complete: () => {
            if (state.state === 'First') {
                state.state = 'Second';
                queue.forEach((q) => {
                    if (state.state === 'Second') {
                        if (q.type === 'Next') {
                            o.next(q.value);
                        }
                        else if (q.type === 'Error') {
                            o.error(q.value);
                            state.state = 'None';
                        }
                        else if (q.type === 'Complete') {
                            o.complete();
                            state.state = 'None';
                        }
                        else {
                            throw Error('Unknown type in concat dequeuing'); // Should not be possible
                        }
                    }
                });
            }
        }
    };
}
function patchSecondObserver(o, state, queue) {
    return {
        next: (x) => {
            if (state.state === 'First') {
                queue.push({ type: 'Next', value: x });
            }
            else if (state.state === 'Second') {
                o.next(x);
            }
        },
        error: (e) => {
            if (state.state === 'First') {
                queue.push({ type: 'Error', value: e });
            }
            else if (state.state === 'Second') {
                state.state = 'None';
                o.error(e);
            }
        },
        complete: () => {
            if (state.state === 'First') {
                queue.push({ type: 'Complete' });
            }
            else if (state.state === 'Second') {
                state.state = 'None';
                o.complete();
            }
        }
    };
}
//# sourceMappingURL=concat.js.map