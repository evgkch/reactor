const reactions = new WeakMap;
/**
 * Function' call with reaction
 */
export var Cx;
(function (Cx) {
    /**
     * Call func and provides reaction to it subscribers.
     *
     * Ex.: cx.call(<func>, ...args)
     * Returns the func result
     */
    function call(f, ...args) {
        const res = f(...args);
        const listeners = reactions.get(f);
        if (listeners && listeners.size > 0)
            for (const cb of listeners)
                cb(res, ...args);
        return res;
    }
    Cx.call = call;
    /**
     * Call func async and provides reaction to it subscribers.
     *
     * Ex.: cx.call_async(<func>, ...args)
     * Returns the func result promise
     */
    function call_async(f, ...args) {
        return new Promise((resolve) => setTimeout(() => resolve(call(f, ...args)), 0));
    }
    Cx.call_async = call_async;
})(Cx || (Cx = {}));
/**
 * Function' subscription manage
 */
export var Rx;
(function (Rx) {
    /**
     * Subscribe on a func call
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    function on(f, listener) {
        const listeners = reactions.get(f);
        if (listeners)
            listeners.add(listener);
        else
            reactions.set(f, new Set([listener]));
        return listener;
    }
    Rx.on = on;
    /**
     * Subscribe on a func call once (subscriber will be deleted after send).
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    function once(f, listener) {
        return on(f, function g(res, ...args) {
            off(f, g);
            listener(res, ...args);
        });
    }
    Rx.once = once;
    /**
     * Subscribe on a func call weak (subscriber will be deleted if it will be dead).
     * Returns a WeakRef of the provided listener.
     *
     * Ex.: rx.onweak(<func>, listener)
     */
    function onweak(f, listener) {
        const ref = new WeakRef(listener);
        on(f, function g(res, ...args) {
            const listener = ref.deref();
            if (listener)
                listener(res, ...args);
            else
                off(f, g);
        });
        return listener;
    }
    Rx.onweak = onweak;
    /**
     * Ubsubscribe listener from the func call.
     * Returns true if func and listener existed, false otherwise.
     *
     * Ex.: rx.off(<func>, listener)
     */
    function off(f, listener) {
        return !!reactions.get(f)?.delete(listener);
    }
    Rx.off = off;
})(Rx || (Rx = {}));
