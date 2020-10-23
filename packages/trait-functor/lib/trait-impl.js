import {extension} from "@prelude/data-trait";
import {Functor}   from "./trait.js";

/**
 * Implements the {@link Functor} trait for {@link Array}.
 * @lends {Array.prototype}
 */
extension(Array.prototype, {
  /**
   * Maps all {@link Array} element values into new ones.
   *
   * @template A, B
   * @this A[]
   * @param {function(A): B} fn
   * The function called for each elements of this array which returns a new
   * value to map to the output array.
   *
   * @returns {B[]}
   * Returns another {@link Array} containing the resulting values.
   */
  [Functor.map](fn) {
    const xs = [];
    const l  = this.length;
    for (let i = 0; i < l; ++i) xs.push(fn(this[i]));
    return xs;
  }
});
