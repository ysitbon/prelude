import {constant, curry}     from "@prelude/function";
import {protocol, extension} from "@prelude/protocol";

export const Functor = protocol({
  map: Symbol("Functor.map")
});

/**
 * @template F, A, B
 * @param {function(A): B} fn
 * @param {F<A>} functor
 * @return {F<B>}
 */
export const map = curry((fn, functor) => functor[Functor.map](fn));

/**
 * Replace all locations in the input with the same value.
 *
 * @template Functor, A, B
 * @param {B} value
 * @param {Functor<A>} functor
 * @return {Functor<B>}
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
    for (let i = 0; i < l; ++i)
      xs.push(f(this[i]));
    return xs;
  }
});
