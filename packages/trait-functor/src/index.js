import {trait, impl} from "@prelude/data-trait";
import {constant}    from "@prelude/data-function";

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
 * @returns {function(F<A>): F<B>}
 * Returns another `functor` containing the resulting values.
 */
export const map = fn => functor => functor[Functor.map](fn);

/**
 * Replace all locations in the input `Functor` with the same `value`.
 *
 * @template {Functor} F
 * @template A, B
 * @param {B} value
 * The value to map over each elements of the input `functor`.
 *
 * @returns {function(F<A>): F<B>}
 * Returns another `functor` containing the same `value` for each elements.
 */
export const constMap = value => functor => functor |> map(constant(value));

////////////////////////////////////////////////////////////////////////////////
/// Array implementation
////////////////////////////////////////////////////////////////////////////////

Array |> impl(Functor, {
  /**
   * Maps all elements values of this {@link Array} reference into new ones.
   *
   * @example
   * [1, 2, 3] |> map(x => x + 1)
   * // => [2, 3, 4]
   *
   * @template A, B
   * @this A[]
   * @param {function(A): B} fn
   * The function which will be called for each elements of this {@link Array}.
   *
   * @returns {B[]}
   * Returns another {@link Array} reference containing the resulting values.
   */
  [Functor.map](fn) {
    const xs = [];
    const l  = this.length;
    for (let i = 0; i < l; ++i) xs.push(fn.call(this, this[i]));
    return xs;
  }
});
