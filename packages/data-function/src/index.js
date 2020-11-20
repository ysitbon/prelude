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

/**
 * Composes two functions from right to left.
 *
 * ```js
 * const greet = str => `Hello, ${str}`;
 * const exclaim = str => `${str}!`;
 * const greetings = exclaim |> compose(greet);
 *
 * greetings("Yoann");
 * // -> Hello, Yoann!
 * ```
 *
 * @template A, B, C
 * @param {function(B): C} g
 * @returns {function(function(A): B): C}
 */
export const compose = g => f => x => f(g(x));

/**
 * Composes two functions from left to right.
 *
 * ```js
 * const greet = str => `Hello, ${str}`;
 * const exclaim = str => `${str}!`;
 * const greetings = greet |> compose(exclaim);
 *
 * greetings("Yoann");
 * // -> Hello, Yoann!
 * ```
 *
 * @template A, B, C
 * @param {function(A): B} f
 * @returns {function(function(B): C): C}
 */
export const pipe = f => g => x => f(g(x));

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
