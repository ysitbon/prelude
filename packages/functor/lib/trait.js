import {trait}           from "@prelude/trait";
import {constant, curry} from "@prelude/function";

/**
 * Represents a type that can be mapped over. Instances of `Functor` should
 * satisfy the following laws:
 *
 * - **Identity**
 *   ```js
 *   map(identity) ≡ identity
 *   ```
 * - **Composition**
 *   ```js
 *   map(pipe(f, g)) ≡ pipe(map(f), map(g))
 *   ```
 */
export const Functor = trait({
  map: Symbol("Functor.map")
});

/**
 * Maps all {@link Functor} element values into new ones.
 *
 * @template {Functor} F
 * @template A, B
 * @param {function(A): B} fn
 * The function called for each elements of the input `functor` which returns
 * a new value to map to the output {@link Functor}.
 *
 * @param {F<A>} functor
 * The input functor to process.
 *
 * @returns {F<B>}
 * Returns another `functor` containing the resulting values.
 */
export const map = curry((fn, functor) => functor[Functor.map](fn));

/**
 * Replace all locations in the input `Functor` with the same `value`.
 *
 * @template {Functor} F
 * @template A, B
 * @param {B} value
 * The value to map over each elements of the input `functor`.
 *
 * @param {F<A>} functor
 * The input functor to process.
 *
 * @returns {F<B>}
 * Returns another `functor` containing the same `value` for each elements.
 */
export const constMap = curry((value, functor) =>
  map(constant(value), functor));

