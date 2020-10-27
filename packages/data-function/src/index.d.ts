import {F, L} from "ts-toolbelt";

/**
 * Curry `f`. The returned function can be partially applied automatically.
 *
 * @example
 * const add = curry((x, y, z) => x + y + z);
 *
 * add(1, 2, 3) // -> 6
 * add(1)(2, 3) // -> 6
 * add(1)(2)(3) // -> 6
 * add(1, 2)(3) // -> 6
 *
 * @param f
 * The function to curry.
 *
 * @return
 * Returns the curried function.
 */
export function curry <Fn extends F.Function>(f: Fn): F.Curry<Fn>;

/**
 * Identity function.
 *
 * @param x
 * The value to return
 *
 * @return
 * Returns the passed argument.
 */
export function identity<A>(x: A): A;

/**
 * Composes two functions `f` and `g` to create a new one. The new function
 * first compute `y=g(x)`, and then use `y` to compute `z=f(y)`.
 *
 * @example
 * const fullName = compose(
 *   intersperse(" ")
 *   map(cap),
 *   props("firstName", "lastName")
 * );
 *
 * getUser(1)
 *   .then(fullName)
 *   .then(console.log)
 * // => "John Doe"
 *
 * @param fns
 * The functions to compose from right to left.
 *
 * @return
 * Returns the new composed function.
 */
export function compose<Fns extends F.Function[]>(
  ...fns: F.Composer<Fns>
): F.Curry<F.Composed<Fns>>;

/**
 * Composes two functions `f` and `g` to create a new one. The new function
 * first compute `y=g(x)`, and then use `y` to compute `z=f(y)`.
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
 * @template Fns
 * @param fns
 * The functions to compose from right to left.
 *
 * @return
 * Returns the new composed function.
 */
export function pipe<Fns extends F.Function[]>(
  ...fns: F.Piper<Fns>
): F.Curry<F.Piped<Fns>>;

/**
 * Flips the two arguments in reverse order of the specified function `f`.
 *
 * @example
 * const add = curry((x, y) => x + " " + y);
 * const addRight = flip(add);
 * addRight("hello", "world");
 * // => "world hello"
 *
 * @param fn
 * The function to flip.
 *
 * @return
 * Returns the flipped function.
 */
export function flip<Fn extends F.Function>(
  fn: Fn
): F.Curry<(...args: L.Reverse<F.Parameters<Fn>>) => F.Return<Fn>>;

/**
 * Creates an unary function which evaluates to `x` for all inputs.
 *
 * ```
 * const fill = pipe(constant, map);
 * fill(42)(new Array(4));
 * // => [42, 42, 42, 42]
 * ```
 *
 * @param x
 * The const value
 * 
 * @return
 * Returns the constant function.
 */
export function constant<A, B>(x: A): ((_: B) => A);

/**
 * Calls the function `f` until the predicate `p` matches. Each times `f` is
 * computed the return value is used for the next `until` cycle.
 *
 * @example
 * until(
 *   xs => head(xs) === 'c',
 *   xs => tail(xs),
 *   ['a', 'b', 'c', 'd']
 * )
 * // => ['c', 'd']
 *
 * @param p
 * The predicate always computed before `f`.
 *
 * @param f
 * The function computed after the predicate `p` returned `false`.
 *
 * @param x
 * The value to pass over the to the predicate `p` and the function `f`.
 */
export const until: F.Curry<<A>(p: (x: A) => boolean, f: (x: A) => A, r: A) => A>;
