/** @lends {Array.prototype} */
extension(Array.prototype, {
  /**
   * @template B
   * @param {B} x 
   * @returns {B[]}
   */
  [Applicative.pure](x) {
    return [x];
  },
  /**
   * @template A
   * @template B
   * @this {((x: A) => B)[]}
   * @param {A[]} mx
   * @return {B[]}
   */
  [Applicative.apply](xs) {
    return this[Functor.map]((fn, i) => fn(xs[i]));
  }
});