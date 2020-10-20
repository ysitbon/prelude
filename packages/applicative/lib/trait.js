import {curry}           from "@prelude/function";
import {trait, deriving} from "@prelude/trait";
import {Functor}         from "@prelude/functor";

/**
 * This module describes a structure intermediate between a functor and a monad
 * (technically, a strong lax monoidal functor). Compared with monads, this
 * interface lacks the full power of the binding operation `flatMap` but it has
 * more instances and it is sufficient for many uses.
 */
export const Applicative = trait({
  [deriving]: [Functor],
  pure: Symbol("Applicative.pure"),
  apply: Symbol("Applicative.apply")
});

/**
 * Sequential application.
 *
 * @template T
 * @template R
 * @template {Applicative} A
 * @param {A<T>} arg
 * The boxed value which will be applied to apply to the boxed function.
 *
 * @param {A<function(T): R>} fn
 * The boxed function.
 *
 * @return {A<R>}
 * Returns the results of function application boxed into a new applicative.
 */
export const apply = curry((arg, fn) => fn[Applicative.apply](arg));

/**
 * Lift a value `x` to a pure .
 *
 * @template {Applicative} A
 * @template T
 * @param {Function} ApplicativeConstructor
 * @param {T} x
 * The value to box.
 *
 * @return {A<T>}
 * Returns the boxed value.
 */
export const pure = curry((ApplicativeConstructor, x) =>
  ApplicativeConstructor.prototype[Applicative.pure](x));

