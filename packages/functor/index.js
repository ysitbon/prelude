import {constant, curry}     from "@prelude/function";
import {protocol, extension} from "@prelude/protocol";

export const Functor = protocol({
  map: Symbol("Functor.map")
});

/**
 * @param {function(a): b}
 * @param {f<r>}
 * @returns {f<a>}
 * @template f, a, b
 */
export const map = curry((fn, scope) => scope[Functor.map](fn));

/**
 * Replace all locations in the input with the same value.
 *
 * @param {a}
 * @param {f<b>}
 * @returns {f<a>}
 * @template f, a, b
 */
export const constMap = curry((value, scope) => map(constant(value), scope));

/**
 * Functor implementation on native Array.
 *
 * @lends {Array.prototype}
 */
extension(Array.prototype, {
  [Functor.map](f) {
    const xs = [];
    const l  = this.length;
    for (let i = 0; i < l; ++i) xs.push(f(this[i]));
    return xs;
  }
});
