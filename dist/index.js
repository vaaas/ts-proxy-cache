"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function make_cache(T = 1 * 60 * 60 * 1000) {
    const Store = {};
    const Functions = {};
    const Timeouts = {};
    const Handler = {
        get(store, key) {
            if (!(key in Timeouts && key in Functions))
                return undefined;
            const now = Date.now();
            if (now > Timeouts[key]) {
                store[key] = Functions[key]();
                Timeouts[key] = now + T;
            }
            return store[key];
        },
        set(store, key, value) {
            Functions[key] = value;
            Timeouts[key] = 0;
            return true;
        },
        deleteProperty(store, key) {
            Timeouts[key] = 0;
            return true;
        },
    };
    return new Proxy(Store, Handler);
}
exports.default = make_cache;
