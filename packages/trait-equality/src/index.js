import {trait, impl}   from "@prelude/data-trait";
import {Species, type} from "@prelude/trait-species";

/**
 * Defines equality and inequality which is done by [equivalence relations].
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
 * Inverse comparison of {@link eq}.
 *
 * @template A
 * @param {A} y
 * The value to compare with `x`.
 *
 * @returns {function(A): boolean}
 * Returns `true` if values are not equals, otherwise `false`.
 */
export const notEq = y => x => !x[Equality.eq](y);

////////////////////////////////////////////////////////////////////////////////
/// Implementations
////////////////////////////////////////////////////////////////////////////////

String |> impl(Equality, {
  /**
   * Native `string` primitive comparison.
   *
   * @example
   * // Native string equality.
   * "1" === 1                  // => false
   * "1" ==  1                  // => true
   * "1" === "1"                // => true
   * "1" === String("1")        // => true
   * "1" === new String("1")    // => false
   * "1" ==  new String("1")    // => true
   *
   * // Equality.eq
   * "1" |> eq(1)               // => false
   * "1" |> eq("1")             // => true
   * "1" |> eq(String("1"))     // => true
   * "1" |> eq(new String("1")) // => true
   *
   * @template T
   * @this string
   * @param {T} other
   * The value to compare with this string.
   *
   * @returns {boolean}
   * Returns `true` if equals otherwise `false`.
   */
  [Equality.eq](other) {
    return other != null
        && Species.type in other
        && (other |> type) === (this |> type)
        && other.valueOf() === (this).valueOf();
  }
});

Number |> impl(Equality, {
  /**
   * Native `number` primitive comparison.
   *
   * @example
   * // Native number equality.
   * 1 === "1"           // => false
   * 1 ==  "1"           // => true
   * 1 === 1             // => true
   * 1 === Number(1)     // => true
   * 1 === new Number(1) // => false
   * 1 ==  new Number(1) // => true
   * NaN ==  NaN         // => false
   * NaN === NaN         // => false
   *
   * // Equality.eq
   * 1 |> eq("1")           // => false
   * 1 |> eq(1)             // => true
   * 1 |> eq(Number(1))     // => true
   * 1 |> eq(new Number(1)) // => true
   * NaN |> eq(NaN)         // => true
   *
   * @template T
   * @this number
   * @param {T} other
   * The value to compare with this number.
   *
   * @returns {boolean}
   * Returns `true` if equals otherwise `false`.
   */
  [Equality.eq](other) {
    return other != null
      && Species.type in other
      && (other |> type)  === (this |> type)
      && (other.valueOf() === (this).valueOf()
        || Number.isNaN(this) && Number.isNaN(other)
      );
  }
});

Boolean |> impl(Equality, {
  /**
   * Native `boolean` primitive comparison.
   *
   * @example
   * // Native boolean equality.
   * true === "1"               // => false
   * true ==  "1"               // => true
   * true === true              // => true
   * true === Boolean(true)     // => true
   * true === new Boolean(true) // => false
   * true ==  new Boolean(true) // => true
   *
   * // Equality.eq
   * true |> eq("1")            // => false
   * true |> eq(true)           // => true
   * true |> eq(Boolean(1))     // => true
   * true |> eq(new Boolean(1)) // => true
   *
   * @template T
   * @this boolean
   * @param {T} other
   * The value to compare with this number.
   *
   * @returns {boolean}
   * Returns `true` if equals otherwise `false`.
   */
  [Equality.eq](other) {
    return other != null
      && Species.type in other
      && (other |> type) === (this |> type)
      && other.valueOf() === (this).valueOf();
  }
});
