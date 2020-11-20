import {trait, deriving, impl} from "@prelude/data-trait";
import {Functor}               from "@prelude/trait-functor";

/**
 * A {@link Functor} with application. Instances of `Applicative` should satisfy
 * the following laws:
 *
 * - **Identity**
 *   ```js
 *   map(identity) === identity
 *   ```
 * - **Composition**
 *   ```js
 *   pipe |> pure(A) |> apply(u) |> apply(v) |> apply(w) === w |> apply(v |> apply(u))
 *   ```
 * - **Homomorphism**
 *   ```js
 *   f |> pure(A) |> apply(x |> pure(A)) === f(x) |> pure(A)
 *   ```
 * - **Interchange**
 *   ```js
 *   u |> apply(x |> pure(A)) === (f => f(x)) |> pure(A) |> apply(u)
 *   ```
 */
export const Applicative = trait({
  [deriving]: [Functor],
  pure: Symbol("Applicative.pure"),
  apply: Symbol("Applicative.apply")
});

/**
 * Sequential application over all element of a {@link Functor}.
 *
 * @template {Applicative & Functor} F
 * @template A, B
 * @param {F<A>} functorArg
 * A {@link Functor} where each elements will be applied to the function
 * their supplied `functorFn`.
 *
 * @returns {function(F<(function(A): B)>): F<B>}
 * Returns the results of function application into a new {@link Functor}.
 */
export const apply = functorArg => functorFn =>
  functorFn[Applicative.apply](functorArg);

/**
 * Lift a `value` into a pure {Applicative} functor.
 *
 * @template {Applicative} A
 * @template T
 * @param {function(T): A<T>} F
 * The applicative functor constructor.
 *
 * @returns {A<T>}
 * Returns the boxed value.
 */
export const pure = F => value =>
  F.prototype[Applicative.pure](value);

////////////////////////////////////////////////////////////////////////////////
/// Implementations
////////////////////////////////////////////////////////////////////////////////

Array |> impl(Applicative, {
  /**
   * Lift a `value` into an {@link Array} reference.
   *
   * @template A
   * @param {A} value
   * The value to wrap.
   *
   * @returns {A[]}
   * Returns the specified value wrapped into an {@link Array} reference.
   */
  [Applicative.pure](value) {
    return [value];
  },

  /**
   * Sequential application over all elements of an {@link Array} reference.
   *
   * @template A, B
   * @this {(function(A): B)[]}
   * @param {A[]} xs
   * An {@link Array} reference where each elements will be applied to the
   * function matching the element of this array.
   *
   * @returns {B[]}
   * Returns the results of each applications into a another {@link Array}
   * reference.
   */
  [Applicative.apply](xs) {
    const ln = this.length;
    const ys = new Array(ln);
    for (let i = 0; i < ln; ++i) ys[i] = this[i](xs[i]);
    return ys;
  }
});
