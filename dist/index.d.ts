export declare type Func = (...args: any[]) => any;
export declare type OnFrame<F extends Func> = (y: ReturnType<F>, ...xs: Parameters<F>) => void;
export declare type Reactions = WeakMap<Func, Set<OnFrame<Func>>>;
export default class Reactor {
    #private;
    readonly cx: Cx;
    readonly rx: Rx;
}
/**
 * Function' call with reaction
 */
export declare class Cx {
    #private;
    constructor(reactions: Reactions);
    /**
     * Call func and provides reaction to it subscribers.
     *
     * Ex.: cx.call(<func>, ...args)
     * Returns the func result
     */
    call<F extends Func>(f: F, ...args: Parameters<F>): ReturnType<F>;
    /**
     * Call func async and provides reaction to it subscribers.
     *
     * Ex.: cx.call_async(<func>, ...args)
     * Returns the func result promise
     */
    call_async<F extends Func>(f: F, ...args: Parameters<F>): Promise<ReturnType<F>>;
}
/**
 * Function' subscription manage
 */
export declare class Rx {
    #private;
    constructor(reactions: Reactions);
    /**
     * Subscribe on a func call
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    on<F extends Func>(f: F, listener: OnFrame<F>): OnFrame<F>;
    /**
     * Subscribe on a func call once (subscriber will be deleted after send).
     * Returns the provided listener.
     *
     * Ex.: rx.once(<func>, listener)
     */
    once<F extends Func>(f: F, listener: OnFrame<F>): OnFrame<F>;
    /**
     * Subscribe on a func call weak (subscriber will be deleted if it will be dead).
     * Returns a WeakRef of the provided listener.
     *
     * Ex.: rx.onweak(<func>, listener)
     */
    onweak<F extends Func>(f: F, listener: OnFrame<F>): OnFrame<F>;
    /**
     * Ubsubscribe listener from the func call.
     * Returns true if func and listener existed, false otherwise.
     *
     * Ex.: rx.off(<func>, listener)
     */
    off<F extends Func>(f: F, listener: OnFrame<F>): boolean;
}
