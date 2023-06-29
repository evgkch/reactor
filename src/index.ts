export type Func = (...args: any[]) => any;

export type Listener<F extends Func> = (res: ReturnType<F>, ...args: Parameters<F>) => void;

const reactions = new WeakMap;

/**
 * Function' call with reaction
 */
export namespace Cx {

	/**
	 * Call func and provides reaction to it subscribers.
	 *
	 * Ex.: cx.call(<func>, ...args)
	 * Returns the func result
	 */
	export function call<F extends Func>(f: F, ...args: Parameters<F>): ReturnType<F> {
		const res = f(...args);
		const listeners = reactions.get(f);
		if (listeners && listeners.size > 0) for (const cb of listeners) cb(res, ...args);
		return res;
	}

	/**
	 * Call func async and provides reaction to it subscribers.
	 *
	 * Ex.: cx.call_async(<func>, ...args)
	 * Returns the func result promise
	 */
	export function call_async<F extends Func>(f: F, ...args: Parameters<F>): Promise<ReturnType<F>> {
		return new Promise((resolve) =>
			setTimeout(() => resolve(call(f, ...args)), 0)
		);
	}

}

/**
 * Function' subscription manage
 */
export namespace Rx {

	/**
	 * Subscribe on a func call
     * Returns the provided listener.
	 *
	 * Ex.: rx.once(<func>, listener)
	 */
	export function on<F extends Func>(f: F, listener: Listener<F>): Listener<F> {
		const listeners = reactions.get(f) as Set<Listener<F>> | void;
		if (listeners)
			listeners.add(listener);
		else
			reactions.set(f, new Set([listener]));

		return listener;
  	}

	/**
	 * Subscribe on a func call once (subscriber will be deleted after send).
     * Returns the provided listener.
	 *
	 * Ex.: rx.once(<func>, listener)
	 */
	export function once<F extends Func>(f: F, listener: Listener<F>): Listener<F> {
		return on(f, function g(res, ...args) {
			off(f, g);
			listener(res, ...args);
		});
  	}

	/**
	 * Subscribe on a func call weak (subscriber will be deleted if it will be dead).
     * Returns a WeakRef of the provided listener.
	 *
	 * Ex.: rx.onweak(<func>, listener)
	 */
	export function onweak<F extends Func>(f: F, listener: Listener<F>): Listener<F> {
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

	/**
	 * Ubsubscribe listener from the func call.
     * Returns true if func and listener existed, false otherwise.
	 *
	 * Ex.: rx.off(<func>, listener)
	 */
	export function off<F extends Func>(f: F, listener: Listener<F>): boolean {
		return !!reactions.get(f)?.delete(listener);
	}

}