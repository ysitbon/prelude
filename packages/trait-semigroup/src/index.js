import {trait} from "@prelude/data-trait";

/**
 * Represents a type that can be mapped over. Instances of `Functor` should
 * satisfy the following laws:
 *
 * - **Associativity:** `x |> append(y |> append(z))` equals
 *   `x |> append(y) |> append(z)`
 */
export const Semigroup = trait({
  append: Symbol("Semigroup.append")
});

/**
 * Computes an associative operation between 2 {@link Semigroup} references.
 *
 * @template {Semigroup} S
 * @param {S} y
 * @returns {function(x: S): S}
 * Returns a new {@link Semigroup} containing `x` and `y`.
 */
export const append = y => x => x[Semigroup.append](y);

