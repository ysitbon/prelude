import {curry}           from "@prelude/data-function";
import {trait, deriving} from "@prelude/data-trait";
import {Functor}         from "@prelude/trait-functor";

/**
 * A {@link Functor} with application. Instances of `Applicative` should satisfy
 * the following laws:
 *
 * - **Identity**
 *   ```js
 *   map(identity) ≡ identity
 *   ```
 * - **Composition**
 *   ```js
 *   pipe
 *     |> pure(A)
 *     |> apply(u)
 *     |> apply(v)
 *     |> apply(w) ≡ w |> apply(v |> apply(u))
 *   ```
 * - **Homomorphism**
 *   ```js
 *   f |> pure(A) |> apply(x |> pure(A)) ≡ f(x) |> pure(A)
 *   ```
 * - **Interchange**
 *   ```js
 *   u |> apply(x |> pure(A)) ≡ (f => f(x)) |> pure(A) |> apply(u)
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
 * matching the element of in input `functorFn`.
 *
 * @param {F<function(A): B>} functorFn
 * A {@link Functor} where each elements are function which will receive values
 * from `functorArg` as argument.
 *
 * @returns {F<B>}
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
 * The applicative constructor.
 *
 * @param {T} value
 * The value wrap into the `Applicative`.
 *
 * @returns {A<T>}
 * Returns the boxed value.
 */
export const pure = F => value =>
  F.prototype[Applicative.pure](value);

