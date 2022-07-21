"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function make_cache(Store, T = 1 * 60 * 60 * 1000) {
    const Timeouts = {};
    const Handler = {
        get(store, key) {
            const now = Date.now();
            if (now > Timeouts[key]) {
                delete Store[key];
                return undefined;
            }
            else
                return store[key];
        },
        set(store, key, value) {
            Store[key] = value;
            Timeouts[key] = Date.now() + T;
            return true;
        },
        deleteProperty(store, key) {
            delete Timeouts[key];
            delete Store[key];
            return true;
        },
    };
    return new Proxy(Store, Handler);
}
exports.default = make_cache;
