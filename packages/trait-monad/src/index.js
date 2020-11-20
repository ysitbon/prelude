import {trait, deriving, impl} from "@prelude/data-trait";
import {Applicative}           from "@prelude/trait-applicative";

/**
 * The monad trait defines the basic operations over a monad, a concept from a
 * branch of mathematics known as category theory. Instances of Monad should
 * satisfy the following laws:
 *
 * - **Left identity**
 *   ```js
 *   x |> pure(M) |> flatMap(f) = f(x)
 *   ```
 * - **Right identity**
 *   ```
 *   m |> flatMap(pure(M)) = m
 *   ```
 * - **Associativity**
 *   ```
 *   m |> flatMap(x => f(x) |> flatMap(g)) = m |> flatMap(f) |> flatMap(g)
 *   ```
 */
export const Monad = trait({
  [deriving]: [Applicative],
  flatMap: Symbol("Monad.flatMap")
});

/**
 * Bind an action for each elements of a {@link Monad<A>} resulting into a
 * new {@link Monad<B>} .
 *
 * @template {Monad} M
 * @template A
 * @template B
 * @param {function(A): M<B>} fn
 * The function called for each elements of this array which returns a new
 * array of values then concatenated to the output {@link Monad<B>}.
 *
 * @param {M<A>} fn
 * The input monad to compose with.
 *
 * @return {M<B>}
 * Returns another {@link Monad} being the concatenation of all actions.
 */
export const flatMap = fn => m => m[Monad.flatMap](fn);

////////////////////////////////////////////////////////////////////////////////
/// Implementations
////////////////////////////////////////////////////////////////////////////////

Array |> impl(Monad, {
  /**
   * Binds an action for each elements of an {@link Array} resulting into a
   * new {@link Array}.
   *
   * @example
   * const take = n => xs => xs.slice(0, n);
   * const skip = n => xs => xs.slice(n);
   *
   * assert.deepStrictEqual(
   *   [[1, "a"], [2, "b"], [3, "c"]] |> flatMap(take(1)),
   *   [1, 2, 3]
   * );
   * assert.deepStrictEqual(
   *   [[1, "a"], [2, "b"], [3, "c"]] |> flatMap(skip(1)),
   *   ["a", "b", "c"]
   * );
   *
   * @template A
   * @template B
   * @this {A[]}
   * @param {function(A): B[]} fn
   * The function which will be called for each elements of this `Array` and
   * which returns a new `Array` of `B` values which will be concatenated to
   * the output {@link Array<B>}.
   *
   * @return {B[]}
   * Returns another {@link Array} being the concatenation of all actions
   * results.
   */
  [Monad.flatMap](fn) {
    const ln = this.length;
    const ys = [];
    for (let i = 0; i < ln; ++i) ys.push(...fn(this[i]));
    return ys;
  }
});
