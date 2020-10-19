// Native JS types implementation
import {extension}   from "@prelude/trait";
import {Applicative} from "./trait.js";

/** @lends {Array.prototype} */
extension(Array.prototype, {
    /**
     * Lift a value to an `Array` functor.
     *
     * @template A
     * @param {A} x
     * The value to box.
     *
     * @return {A[]}
     * Returns the specified value boxed as an `Array` functor.
     */
    [Applicative.pure](x) {
        return [x];
    },

    /**
     * Sequential application over all elements of an `Array` functor.
     *
     * @template T
     * @template R
     * @this {Array<function(T): R>}
     * @param {T[]} xs
     * @return {R[]}
     */
    [Applicative.apply](xs) {
        const ln = this.length;
        const ys = new Array(ln);
        for (let i = 0; i < ln; ++i) ys[i] = this[i](xs[i]);
        return ys;
    }
});
