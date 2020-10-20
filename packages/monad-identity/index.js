import {extension}   from "@prelude/trait";
import {Functor}     from "@prelude/functor";
import {Applicative} from "@prelude/applicative";
import {Monad}       from "@prelude/monad";

/**
 * The `Identity` monad is a monad that without any computational strategy.
 * It just applies functions to its input without any additional modification.
 * It is mainly defined for its fundamental role in the theory of monad
 * transformers. Any monad transformer applied to the `Identity` monad yields
 * to a non-transformer version of that monad.
 *
 * @template A
 * @param {A} value
 * @returns {Identity<A>}
 * @constructor
 */
export function Identity(value) {
  if (undefined === new.target) {
    return new Identity(value);
  }
  this.value = value;
}

/**
 * Implements trait:
 *
 * - {@link Functor}
 * - {@link Applicative}
 * - {@link Monad}
 *
 * @lends {Identity.prototype}
 */
extension(Identity.prototype, {
  /**
   * Maps the this {@link Identity} value into a new one.
   *
   * @template A, B
   * @this Identity<A>
   * @param {function(A): B} fn
   * The function to apply to this {@link Identity} value
   *
   * @returns {Identity<B>}
   * Returns the new created {@link Identity} reference.
   */
  [Functor.map](fn) {
    return Identity(fn(this.value));
  },

  /**
   * Wraps the specified value into a new {@link Identity} monad.
   *
   * @template A
   * @param {A} x
   * The value to wrap into.
   *
   * @returns {Identity<A>}
   * Returns the created {@link Identity} reference.
   */
  [Applicative.pure](x) {
    return Identity(x);
  },

  /**
   * Applies the specified {@link Identity} value to this {@link Identity}
   * function and wrap its result into a new {@link Identity} reference.
   *
   * @template A, B
   * @this Identity<function(A): B>
   * @param {Identity<A>} fx
   * The value to pass to the function argument.
   *
   * @returns {Identity<B>}
   * Returns the created {@link Identity} reference.
   */
  [Applicative.apply](fx) {
    return this[Applicative.pure](this.value(fx.value));
  },

  /**
   * Applies the action `fn` to this {@link Identity} monad and returns its
   * resulting {@link Identity}.
   *
   * @template A, B
   * @this Identity<A>
   * @param {function(A): Identity<B>} fn
   * The action function to apply.
   *
   * @returns {Identity<B>}
   * Returns the created {@link Identity} monad.
   */
  [Monad.flatMap](fn) {
    return fn(this.value);
  }
});
