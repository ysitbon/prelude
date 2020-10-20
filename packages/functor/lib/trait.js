import {trait}           from "@prelude/trait";
import {constant, curry} from "@prelude/function";

export const Functor = trait({
  map: Symbol("Functor.map")
});

/**
 * @template {Functor} F
 * @template A, B
 * @param {function(A): B} fn
 * @param {F<A>} functor
 * @return {F<B>}
 */
export const map = curry((fn, functor) => functor[Functor.map](fn));

/**
 * Replace all locations in the input `Functor` with the same `value`.
 *
 * @template {Functor} F
 * @template A, B
 * @param {B} value
 * @param {F<A>} functor
 * @return {F<B>}
 */
export const constMap = curry((value, functor) =>
  map(constant(value), functor));

