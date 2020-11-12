import {trait, deriving} from "@prelude/data-trait";
import {Applicative}     from "@prelude/trait-applicative";

/**
 * The monad trait defines the basic operations over a monad, a concept from
 * a branch of mathematics known as category theory. Instances of Monad should
 * satisfy the following laws:
 *
 * - **Left identity**
 *   ```js
 *   x |> pure(M) |> flatMap(k) = k(x)
 *   ```
 * - **Right identity**
 *   ```
 *   m |> flatMap(pure(M)) = m
 *   ```
 * - **Associativity**
 *   ```
 *   m |> flatMap(x => k(x) |> flatMap(h)) = m |> flatMap(k) |> flatMap(h)
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
