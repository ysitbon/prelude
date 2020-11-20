import {impl}        from "@prelude/data-trait";
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

////////////////////////////////////////////////////////////////////////////////
/// Implementations
////////////////////////////////////////////////////////////////////////////////

Identity |> impl(Functor, {
  /**
   * Maps the element value of this {@link Identity} reference into a new one.
   *
   * @template A, B
   * @this Identity<A>
   * @param {function(A): B} fn
   * The function which will be called for the element of this {@link Identity}
   * reference.
   *
   * @returns {Identity<B>}
   * Returns another {@link Identity} reference containing the resulting value.
   */
  [Functor.map](fn) {
    return Identity(fn(this.value));
  }
});

Identity |> impl(Applicative, {
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
   * Applies the specified {@link Identity} value as argument of the function
   * from this {@link Identity} reference and then wrap its results into a new
   * {@link Identity} value.
   *
   * @template A, B
   * @this Identity<function(A): B>
   * @param {Identity<A>} fx
   * The argument value to apply to this {@link Identity} reference.
   *
   * @returns {Identity<B>}
   * Returns the new {@link Identity} value.
   */
  [Applicative.apply](fx) {
    return this[Applicative.pure](this.value(fx.value));
  }
});

Identity |> impl(Monad, {
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
