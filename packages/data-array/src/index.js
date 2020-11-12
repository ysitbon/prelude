import {extension}   from "@prelude/data-trait";
import {Functor}     from "@prelude/trait-functor";
import {Applicative} from "@prelude/trait-applicative";
import {Monad}       from "@prelude/trait-monad";

/** @lends {Array.prototype} */
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
    for (let i = 0; i < l; ++i) xs.push(fn.call(this, this[i]));
    return xs;
  },

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
  },

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
    for (let i = 0; i < ln; ++i) ys.push(...fn.call(this, this[i]));
    return ys;
  }
});
