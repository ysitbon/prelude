// Native JS types implementation
import {extension}   from "@prelude/trait";
import {Applicative} from "./trait.js";

/**
 * Implements the {@link Applicative} trait for {@link Array}.
 * @lends {Array.prototype}
 */
extension(Array.prototype, {
  /**
   * Lift a `value` into an {@link Array} functor.
   *
   * @template A
   * @param {A} value
   * The value to wrap.
   *
   * @returns {A[]}
   * Returns the specified value wrapped into {@link Array} functor.
   */
  [Applicative.pure](value) {
    return [value];
  },

  /**
   * Sequential application over all elements of a {@link Array} functor.
   *
   * @template A, B
   * @this {(function(A): B)[]}
   * @param {A[]} xs
   * A {@link Functor} where each elements will be applied to the function
   * matching the element of this array.
   *
   * @returns {B[]}
   * Returns the results of function application into a new {@link Array}.
   */
  [Applicative.apply](xs) {
    const ln = this.length;
    const ys = new Array(ln);
    for (let i = 0; i < ln; ++i) ys[i] = this[i](xs[i]);
    return ys;
  }
});
