import {extension} from "@prelude/data-trait";
import {Monad}     from "./trait.js";

/**
 * Implements the {@link Monad} trait for {@link Array}.
 * @lends {Array.prototype}
 */
extension(Array.prototype, {
  /**
   * Bind an action for each elements of an {@link Array<A>} resulting into a
   * new {@link Array<B>} .
   *
   * @template A
   * @template B
   * @this {A[]}
   * @param {function(A): B[]} fn
   * The function called for each elements of this array which returns a new
   * array of values then concatenated to the output {@link Array<B>}.
   *
   * @return {B[]}
   * Returns another {@link Array} being the concatenation of all actions.
   */
  [Monad.flatMap](fn) {
    const ln = this.length;
    const ys = [];
    for (let i = 0; i < ln; ++i) ys.push(...fn(this[i]));
    return ys;
  }
});
