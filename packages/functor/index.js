import {compose, constant, curry} from "@prelude/function";
import {protocol, extension}      from "@prelude/protocol";

export const Functor = protocol({
  map: Symbol("Functor.map")
});

/**
 * @param {function(a):b}
 * @param {f<r>}
 * @returns {f<a>}
 * @template f, a, b
 * @function Functor f => (a -> b) -> f a -> f b
 */
export const map = curry((g, x) => x[Functor.map](g));

/**
 * Replace all locations in the input with the same value.
 *
 * @param {a}
 * @param {f<b>}
 * @returns {f<a>}
 * @template f, a, b
 * @function Functor f => a -> f b -> f a
 */
export const constMap = compose(map, constant);

/**
 * Functor implementation on native Array.
 *
 * @lends {Array.prototype}
 */
instance(Array.prototype, {
  [Functor.map](f) {
    const xs = [];
    const l  = this.length;
    for (let i = 0; i < l; ++i) xs.push(f(this[i]));
    return xs;
  }
});

/**
 * Functor implementation on native String.
 *
 * @lends {String.prototype}
 */
instance(String.prototype, {
  [Functor.map](f) {
    const xs = [];
    const l  = this.length;
    for (let i = 0; i < l; ++i) xs.push(f(this.charAt(i)));
    return xs;
  }
});
