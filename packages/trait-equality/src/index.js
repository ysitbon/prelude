import {trait} from "@prelude/data-trait";

/**
 * The `Eq` defines equality and inequality which is done by [equivalence
 * relations]
 *
 * - **Reflexivity:** `x |> eq(x)` equals `true`
 * - **Symmetry:** `x |> eq(y)` then `y |> eq(x)`
 * - **Transitivity:** if `x |> eq(y) && y |> eq(z)` then `x |> eq(z)`
 *
 * [equivalence relations]: https://en.wikipedia.org/wiki/Equivalence_relation
 */
export const Equality = trait({
  eq: Symbol("Equality.eq")
});

/**
 * Compares `x` and `y` values to be equal.
 *
 * @template A
 * @param {A} y
 * The value to compare with `x`.
 *
 * @returns {function(A): boolean}
 * Returns `true` if values are equals, otherwise `false`.
 */
export const eq = y => x => x[Equality.eq](y);

/**
 * Inverse comparison fo {@link eq}.
 *
 * @template A
 * @param {A} y
 * The value to compare with `x`.
 *
 * @returns {function(A): boolean}
 * Returns `true` if values are not equals, otherwise `false`.
 */
export const notEq = y => x => !x[Equality.eq](y);
