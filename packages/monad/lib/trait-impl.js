import {extension} from "@prelude/trait";
import {Monad}     from "./trait.js";

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
    const ln = this.length;
    const ys = [];
    for (let i = 0; i < ln; ++i) ys.push(...fn(this[i]));
    return ys;
  }
});
