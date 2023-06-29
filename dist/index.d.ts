export declare type Func = (...args: any[]) => any;
export declare type Listener<F extends Func> = (res: ReturnType<F>, ...args: Parameters<F>) => void;
/**
 * Function' call with reaction
 */
export declare namespace Cx {
    /**
     * Call func and provides reaction to it subscribers.
     *
     * Ex.: cx.call(<func>, ...args)
     * Returns the func result
     */
    function call<F extends Func>(f: F, ...args: Parameters<F>): ReturnType<F>;
    /**
     * Call func async and provides reaction to it subscribers.
     *
     * Ex.: cx.call_async(<func>, ...args)
     * Returns the func result promise
     */
    function call_async<F extends Func>(f: F, ...args: Parameters<F>): Promise<ReturnType<F>>;
}
/**
 * Function' subscription manage
 */
export declare namespace Rx {
    /**
     * Subscribe on a func call
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    function on<F extends Func>(f: F, listener: Listener<F>): Listener<F>;
    /**
     * Subscribe on a func call once (subscriber will be deleted after send).
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    function once<F extends Func>(f: F, listener: Listener<F>): Listener<F>;
    /**
     * Subscribe on a func call weak (subscriber will be deleted if it will be dead).
     * Returns a WeakRef of the provided listener.
     *
     * Ex.: rx.onweak(<func>, listener)
     */
    function onweak<F extends Func>(f: F, listener: Listener<F>): Listener<F>;
    /**
     * Ubsubscribe listener from the func call.
     * Returns true if func and listener existed, false otherwise.
     *
     * Ex.: rx.off(<func>, listener)
     */
    function off<F extends Func>(f: F, listener: Listener<F>): boolean;
}
