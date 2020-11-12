/**
 * Identity function.
 *
 * @template A
 * @param {A} x
 * The value to return
 *
 * @returns {A}
 * Returns the passed argument.
 */
export const identity = x => x;

export const compose = f => g => x => f(g(x));

/**
 * Composes at least two functions from left to right and returns a new
 * function. The new created function takes the same amount of arguments
 * than the first composed function to call and is also curried.
 *
 * @example
 * const fullName = compose(
 *   intersperse(" "),
 *   map(cap),
 *   props("firstName", "lastName")
 * );
 *
 * getUser(1)
 *   .then(fullName)
 *   .then(console.log)
 * // => "John Doe"
 *
 * @template {Function} Fn
 * @template {Fn[]} Fns
 * @param {...Fn} fns
 * The functions to compose from right to left.
 *
 * @returns {Function}
 * Returns the new composed function.
 */
export const composeAll = (...fns) => x => fns
  .slice(0, -1)
  .reduceRight((x, fn) => fn(x), fns[fns.length - 1](x));

/**
 * @template A, B, C
 * @type {function(function(B): C): function(function(A): B): function(A): C}
 */
export const pipe = f => g => x => g(f(x));

/**
 * Composes two functions from left to right and returns a new
 * function.
 *
 * @example
 * const fullName = pipe(
 *   props("firstName", "lastName"),
 *   map(cap),
 *   intersperse(" ")
 * );
 *
 * getUser(1)
 *   .then(fullName)
 *   .then(console.log)
 * // => "John Doe"
 *
 * @template {Function} Fn
 * @template {Fn[]} Fns
 * @param {...Fn} fns
 * The functions to compose from right to left.
 *
 * @returns {Piped<Fns>}
 * Returns the new composed function.
 */
export const pipeAll = (...fns) => x => fns
  .slice(1)
  .reduce((x, fn) => fn(x), fns[0](x));

/**
 * Flips the arguments in reverse order of the specified function `f`. The
 * created function is curried.
 *
 * @example
 * const add = x => y => x + " " + y;
 * const addRight = flip(add);
 * addRight("hello", "world");
 * // => "world hello"
 *
 * @template A
 * @template B
 * @template C
 * @param {function(A): function(B): C} fn
 * The function to flip.
 *
 * @returns {function(B): function(A): C}
 * Returns the flipped function.
 */
export const flip = fn => y => x => fn(x)(y);

/**
 * Creates an unary function which evaluates to `x` for all inputs.
 *
 * ```
 * const fill = pipe(constant, map);
 * fill(42)(new Array(4));
 * // => [42, 42, 42, 42]
 * ```
 *
 * @template A
 * @template B
 * @param {A} x
 * The const value
 *
 * @returns {function(B): A}
 * Returns the constant function.
 */
export const constant = x => _ => x;

/**
 * Calls the function `f` until the predicate `p` matches. Each times `f` is
 * computed the returned value is used as the next input of `until` cycle.
 *
 * @example
 * until(
 *   xs => head(xs) === 'c',
 *   xs => tail(xs),
 *   ['a', 'b', 'c', 'd']
 * )
 * // => ['c', 'd']
 *
 * @template A
 * @param p
 * The predicate always computed before `f`.
 *
 * @return
 * - The function computed after the predicate `p` returned `false`.
 * - The value to pass over the to the predicate `p` and the function `f`.
 */
export const until = p => f => x => {
  let curr = x;
  while (!p(curr)) curr = f(curr);
  return curr;
};
