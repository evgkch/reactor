export default class Reactor {
    #reactions = new WeakMap;
    cx = new Cx(this.#reactions);
    rx = new Rx(this.#reactions);
}
/**
 * Function' call with reaction
 */
export class Cx {
    #reactions;
    constructor(reactions) {
        this.#reactions = reactions;
    }
    /**
     * Call func and provides reaction to it subscribers.
     *
     * Ex.: cx.call(<func>, ...args)
     * Returns the func result
     */
    call(f, ...args) {
        const res = f(...args);
        const listeners = this.#reactions.get(f);
        if (listeners && listeners.size > 0)
            for (const cb of listeners)
                cb(res, ...args);
        return res;
    }
    /**
     * Call func async and provides reaction to it subscribers.
     *
     * Ex.: cx.call_async(<func>, ...args)
     * Returns the func result promise
     */
    call_async(f, ...args) {
        return new Promise((resolve) => setTimeout(() => resolve(this.call(f, ...args)), 0));
    }
}
/**
 * Function' subscription manage
 */
export class Rx {
    #reactions;
    constructor(reactions) {
        this.#reactions = reactions;
    }
    /**
     * Subscribe on a func call
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    on(f, listener) {
        const listeners = this.#reactions.get(f);
        if (listeners)
            listeners.add(listener);
        else
            this.#reactions.set(f, new Set([listener]));
        return listener;
    }
    /**
     * Subscribe on a func call once (subscriber will be deleted after send).
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    once(f, listener) {
        return this.on(f, (self => function g(res, ...args) {
            self.off(f, g);
            listener(res, ...args);
        })(this));
    }
    /**
     * Subscribe on a func call weak (subscriber will be deleted if it will be dead).
     * Returns a WeakRef of the provided listener.
     *
     * Ex.: rx.onweak(<func>, listener)
     */
    onweak(f, listener) {
        const ref = new WeakRef(listener);
        this.on(f, (self => function g(res, ...args) {
            const listener = ref.deref();
            if (listener)
                listener(res, ...args);
            else
                self.off(f, g);
        })(this));
        return listener;
    }
    /**
     * Ubsubscribe listener from the func call.
     * Returns true if func and listener existed, false otherwise.
     *
     * Ex.: rx.off(<func>, listener)
     */
    off(f, listener) {
        return !!this.#reactions.get(f)?.delete(listener);
    }
}
