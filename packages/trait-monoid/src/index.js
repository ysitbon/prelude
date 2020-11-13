import {Semigroup}       from "@prelude/trait-semigroup";
import {trait, deriving} from "@prelude/data-trait";

/**
 * Empty representation of any type like `0` being the empty value of `Number`
 * or `[]` being the empty representation of an `Array` reference. Monoid must
 * implement {@link Semigroup}.
 *
 * - **Right identity**
 *   ```js
 *   x |> append(A |> empty) = x
 *   ```
 * - **Left identity**
 *   ```js
 *   A |> empty |> append(x) = x
 *   ```
 */
export const Monoid = trait({
  [deriving]: [Semigroup],
  empty: Symbol("Monoid.empty")
});

/**
 * Gets empty reference of a {@link Monoid}.
 *
 * @template {Monoid} M
 * @param {M} F
 * The monoid constructor.
 *
 * @returns {M}
 * Returns the empty reference.
 */
export const empty = F => F.prototype[Monoid.empty]();

