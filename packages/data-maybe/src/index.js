import {curry}       from "@prelude/data-function";
import {extension}   from "@prelude/data-trait";
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
function Maybe(value) {
  if (this instanceof Just || this instanceof Nothing) {
    this.value = value;
  }
  else {
    throw new TypeError("Data type violation.");
  }
}

/** @lends {Maybe.prototype} */
extension(Maybe.prototype, {
  /**
   * @template A, B
   * @this Maybe<A>
   * @param {function(A): B} fn
   * @returns {Maybe<B>}
   */
  [Functor.map](fn) {
    return isJust(this)
      ? this[Applicative.pure](fn.call(this, this.value))
      : this;
  },

  /**
   * Converts a `a` value to a `Maybe a` object. If the value is `null` or
   * `undefined` then it returns `Nothing`. Otherwise, it returns the `Just<a>`
   * which contains the `a` value.
   *
   * @template A
   * @param {A} value
   * The value to convert.
   *
   * @returns {Maybe<A>}
   * Returns the converted value to `Maybe`.
   */
  [Applicative.pure](value) {
    return (value == null || "number" === typeof value && Number.isNaN(value))
      ? NothingSingleton
      : new Just(value);
  },

  /**
   * Sequential application over a {@link Maybe} value.
   *
   * @template A, B
   * @this Maybe<function(A): B>
   * @param {Maybe<A>} functor
   * A {@link Functor} where each elements will be applied to the function
   * matching the element of this array.
   *
   * @returns {Maybe<B>}
   * Returns the results of function application into a new {@link Array}.
   */
  [Applicative.apply](functor) {
    return isJust(this)
      ? this[Applicative.pure](this.value(functor.value))
      : this;
  },

  /**
   * @template A, B
   * @this Maybe<A>
   * @param {function(A): Maybe<B>} fn
   * @returns {Maybe<B>}
   */
  [Monad.flatMap](fn) {
    return isJust(this)
      ? fn.call(this, this.value)
      : this;
  }
});

/**
 * Representation of a `Maybe` type which contains a value of type `a`.
 *
 * @template A
 * @class Just<A>
 * @extends Maybe<A>
 * @param {A} value
 * @constructor
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
 * @template A
 * @class Nothing
 * @extends Maybe<null>
 * @constructor
 */
export function Nothing() {
  if (!(this instanceof Nothing)) {
    return NothingSingleton || (NothingSingleton = new Nothing());
  }
  else {
    Maybe.call(this, null);
  }
}

Nothing.prototype = Object.create(Maybe.prototype);
let NothingSingleton = new Nothing();

/**
 * Checks whether the specified {@link Maybe} value is {@link Just}.
 *
 * @template A
 * @param {Maybe<A>} maybe
 * @returns {boolean}
 */
export const isJust = maybe => maybe instanceof Just;

/**
 * Checks whether the specified {@link Maybe} value is {@link Nothing}.
 *
 * @template A
 * @param {Maybe<A>} maybe
 * @returns {boolean}
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
 * Extracts the element `a` out of a `Just a` and returns the default value
 * `x` if `m` is `Nothing`.
 *
 * @template A
 * @param {A} defaultValue
 * @param {Maybe<A>} maybe
 * @returns {A}
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
 * @param {A[]} xs
 * @returns {B[]}
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
 * Takes an array of `Maybe` and returns an array of all the `Just` values.
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
