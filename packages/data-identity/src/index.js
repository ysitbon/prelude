import {extension}   from "@prelude/data-trait";
import {Functor}     from "@prelude/trait-functor";
import {Applicative} from "@prelude/trait-applicative";
import {Monad}       from "@prelude/trait-monad";

/**
 * The `Identity` monad is a monad without any computational strategy.
 * It just applies functions to its input as is. It is mainly defined for its
 * fundamental role with monad transformers. Any monad transformer applied to
 * the `Identity` monad yields to a non-transformer version of that monad.
 *
 * @template A
 * @param {A} value
 * @constructor
 */
export function Identity(value) {
  if (undefined === new.target)
    return new Identity(value);
  else
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
   * Maps {@link Identity} element value into a new one.
   *
   * @template A, B
   * @this A[]
   * @param {function(A): B} fn
   * The function which will be called the element of this `Identity` and which
   * returns the new value to map to the output `Identity`.
   *
   * @returns {B[]}
   * Returns another {@link Identity} reference containing the resulting value.
   */
  [Functor.map](fn) {
    return Identity(fn(this.value));
  },

  /**
   * Lift a `value` into an {@link Identity} reference.
   *
   * @template A
   * @param {A} value
   * The value to wrap.
   *
   * @returns {Identity<A>}
   * Returns the specified value wrapped into an {@link Identity} reference.
   */
  [Applicative.pure](value) {
    return Identity(value);
  },

  /**
   * Applies the specified {@link Identity} value to this {@link Identity}
   * function and wrap its result into a new {@link Identity} value.
   *
   * @template A, B
   * @this Identity<function(A): B>
   * @param {Identity<A>} fx
   * The value to pass to the function argument.
   *
   * @returns {Identity<B>}
   * Returns the new {@link Identity} value.
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
