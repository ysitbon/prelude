import {curry}                         from "@prelude/function";
import {protocol, deriving, extension} from "@prelude/protocol";
import {Applicative}                   from "@prelude/applicative";

/**
 * The Monad protocol defines the basic operations over a monad, a concept from
 * a branch of mathematics known as category theory.
 *
 * Instances of Monad should satisfy the following:
 *
 * - Left identity
 *   ```
 *   pure(MonadConstructor, a)[Monad.flatMap](k) = k(a)
 *   ```
 * - Right identity
 *   ```
 *   monaInstance[Monad.flatMap](pure) = monadInstance
 *   ```
 * - Associativity
 *   ```
 *   monadInstance[Monad.flatMap](x => k(x)[Monad.flatMap](h)) = (monadInstance[Monad.flatMap](k))[Monad.flatMap](h)
 *   ```
 */
export const Monad = protocol({
  [deriving]: [Applicative],
  flatMap: Symbol("Monad.flatMap")
});

/**
 * Sequentially compose two actions, passing any value produced by the first as
 * an argument to the second.
 *
 * @template T
 * @template R
 * @template {Monad} M
 * @param {function(T): M<R>} arg
 * The action which returns a new Monad.
 *
 * @param {M<T>} fn
 * The monad to compose with.
 *
 * @return {M<R>}
 * Returns the results of the monad composition.
 */
export const flatMap = curry((fn, m) => m[Monad.flatMap](fn));

// Native JS types implementation
/** @lends {Array.prototype} */
extension(Array.prototype, {
  /**
   * Sequentially compose two actions on an Array monad.
   *
   * @template T
   * @template R
   * @this {Array<T>}
   * @param {function(T): R[]} fn
   * @return {R[]}
   */
  [Monad.flatMap](fn) {
    return this.flatMap(fn);
  }
});
