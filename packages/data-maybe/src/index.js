import {impl}        from "@prelude/data-trait";
import {Functor}     from "@prelude/trait-functor";
import {Applicative} from "@prelude/trait-applicative";
import {Monad}       from "@prelude/trait-monad";

/**
 * `Maybe<A>` type encapsulates an optional value. A value of type `Maybe<A>`
 * either contains a value of type `A`, represented as `Just<A>`, or it is
 * empty and represented as `Nothing`. Using `Maybe` is a good way to deal
 * with errors or exceptional cases without resorting to drastic measures such
 * as error.
 *
 * @template A
 * @class Maybe<A>
 * @param {A} value
 * @constructor
 */
export function Maybe(value) {
  if (this instanceof Just || this instanceof Nothing) {
    this.value = value;
  }
  else {
    throw new TypeError("Data type violation.");
  }
}

/**
 * Representation of a `Maybe` type which contains a value of type `a`.
 *
 * @template A
 * @constructor
 * @extends Maybe<A>
 * @param {A} value
 * The value to wrap into a Just value.
 */
export function Just(value) {
  if (!(this instanceof Just)) {
    return new Just(value);
  }
  else if (value != null) {
    Maybe.call(this, value);
  }
  else {
    throw new TypeError("Just value cannot be null");
  }
}
Just.prototype = Object.create(Maybe.prototype);

/**
 * Representation of a `Maybe` which contains a finite value.
 *
 * @template T
 * @constructor
 * @extends Maybe<T>
 */
export function Nothing() {
  return NothingSingleton;
}
Nothing.prototype = Object.create(Maybe.prototype);

/** Internal instance singleton for {@link Nothing}. */
const NothingSingleton = Object.freeze(Object.create(Nothing.prototype));

/**
 * Checks whether the specified {@link Maybe} value is {@link Just}.
 *
 * @template A
 * @param {Maybe<A>} maybe
 * The {@link Maybe} reference to check.
 *
 * @returns {boolean}
 * Returns `true` if `maybe` is {@link Just}, otherwise `false`.
 */
export const isJust = maybe => maybe instanceof Just;

/**
 * Checks whether the specified {@link Maybe} value is {@link Nothing}.
 *
 * @template A
 * @param {Maybe<A>} maybe
 * The {@link Maybe} reference to check.
 *
 * @returns {boolean}
 * Returns `true` if `maybe` is {@link Nothing}, otherwise `false`.
 */
export const isNothing = maybe => maybe instanceof Nothing;

/**
 * Extracts the element `a` out of a `Just a` and throws an error if its
 * argument is Nothing.
 *
 * @template A
 * @param {Maybe<A>} maybe
 * @returns {A}
 */
export const fromJust = maybe => {
  if (maybe |> isJust)
    return maybe.value;
  else
    throw new TypeError("Nothing cannot be converted to any value");
};

/**
 * Extracts the element out of a {@link Maybe} reference. Returns the
 * `defaultValue` if `maybe` is {@link Nothing}.
 *
 * @template A
 * @param {A} defaultValue
 * The default value to return if `maybe` is {@link Nothing}.
 *
 * @returns {function(Maybe<A>): A}
 * Returns the extracted value.
 */
export const fromMaybe = defaultValue => maybe => maybe |> isJust
  ? maybe.value
  : defaultValue;

/**
 * The `mapMaybe()` function is a version of `map()` which can throw out
 * elements. In particular, the functional argument returns something of
 * type`Maybe<b>`. If this is `Nothing`, no element is added on to the
 * result array. If it is `Just b`, then `b` is included in the result array.
 *
 * @template A,B
 * @param {function(A): Maybe<B>} fn
 * @returns {function(A[]): B[]}
 */
export const mapMaybe = fn => xs => xs.reduce(
  (out, x) => {
    const maybe = fn(x);
    if (maybe |> isJust) out.push(maybe.value);
    return out;
  },
  []
);

/**
 * Takes an array of {@link Maybe} references and returns an array of all the
 * {@link Just} values.
 *
 * @template A
 * @param {Maybe<A>[]} xs
 * The array which contains the `Maybe` values.
 *
 * @returns {A[]}
 * Returns the extracted values.
 */
export const catMaybes = xs => xs.reduce(
  (xs, mx) => {
    if (isJust(mx)) xs.push(mx.value);
    return xs;
  },
  []
);

////////////////////////////////////////////////////////////////////////////////
/// Functor implementation
////////////////////////////////////////////////////////////////////////////////

Maybe |> impl(Functor, {
  /**
   * Maps the element value of this {@link Maybe} reference, into a new one.
   *
   * - If this {@link Maybe} reference is {@link Nothing} then the function
   *   `fn` is skipped and this reference is returned.
   * - If the resulting value returned by the function `fn` is `NaN`, `null`,
   *   or `undefined` then it returns {@link Nothing} otherwise {@link Just}.
   *
   * @example
   * Just(1) |> map(x => x + 1)
   * // => Just(2)
   * Just(1) |> map(x => x / undefined);
   * // => Nothing
   *
   * @template A, B
   * @this Maybe<A>
   * @param {function(A): B} fn
   * The function which will be called for the element of this {@link Maybe}
   * reference. Only if this reference is {@link Just}.
   *
   * @returns {Maybe<B>}
   * Returns another {@link Maybe} reference containing the resulting value.
   */
  [Functor.map](fn) {
    return isJust(this)
      ? this[Applicative.pure](fn(this.value))
      : this;
  }
});

////////////////////////////////////////////////////////////////////////////////
/// Applicative implementation
////////////////////////////////////////////////////////////////////////////////

Maybe |> impl(Applicative, {
  /**
   * Lift a `value` into a {@link Maybe} reference. If the `value` is `NaN`,
   * `null` or `undefined`, it returns {@link Nothing} otherwise {@link Just}.
   *
   * @example
   * 1 |> pure(Maybe)
   * // => Just(1)
   * NaN |> pure(Maybe)
   * // => Nothing
   * null |> pure(Maybe)
   * // => Nothing
   * undefined |> pure(Maybe)
   * // => Nothing
   *
   * @template A
   * @param {A} value
   * The value to wrap.
   *
   * @returns {Maybe<A>}
   * Returns the specified value wrapped into an {@link Maybe} reference.
   */
  [Applicative.pure](value) {
    return (value == null || "number" === typeof value && Number.isNaN(value))
      ? NothingSingleton
      : new Just(value);
  },

  /**
   * Applies the specified {@link Maybe} value as argument of the function
   * from this {@link Maybe} reference and then wrap its result into a new
   * {@link Maybe} value.
   *
   * - If this or the supplied `functor` are {@link Nothing} then no operation
   *   is processed and {@link Nothing} is returned.
   *
   * @template A, B
   * @this Maybe<function(A): B>
   * @param {Maybe<A>} functor
   * The argument value to apply to this {@link Maybe} reference.
   *
   * @returns {Maybe<B>}
   * Returns the new {@link Maybe} value.
   */
  [Applicative.apply](functor) {
    return isJust(this)
      ? this[Applicative.pure](this.value(functor.value))
      : this;
  }
});

////////////////////////////////////////////////////////////////////////////////
/// Monad implementation
////////////////////////////////////////////////////////////////////////////////

Maybe |> impl(Monad, {
  /**
   * @template A, B
   * @this Maybe<A>
   * @param {function(A): Maybe<B>} fn
   * @returns {Maybe<B>}
   */
  [Monad.flatMap](fn) {
    return isJust(this)
      ? fn(this.value)
      : this;
  }
});
