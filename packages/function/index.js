/** Symbols to use functions to store current curried arity */
const curried = Symbol("Function.curried");

/**
 * Attaches `Function.curried` symbol which stores the arguments length
 * currently curried. It is mainly used to retrieve this information when
 * implementing function which acts on other function and want to preserve
 * auto-currying capability. See {@link compose} or {@link pipe} source
 * for custom implementation examples.
 *
 * @template {F.Function} Fn
 * @param {number} n
 * @param {Fn} f
 * The target function.
 *
 * @returns {Fn}
 * Returns the passed function.
 */
const curryF = (n, f) =>
  Object.defineProperty(f, curried, {value: n});

/**
 * Internal logic of `curry` function. Takes `n` as the length of the function
 * `f` and then returned the curried version of this function. The returned
 * function compares the length of the passed `arguments` with `n`. When greater
 * or equal to `n`, then it calls the original reference with the specified
 * `arguments`. Otherwise it call `curryN()` where the new `n` value equals the
 * current `n` value minus the length of the passed `arguments` and the new
 * function reference is the original reference bound to the passed arguments.
 *
 * @template {F.Function} Fn
 * @param {number} n
 * Arity of the function to curry.
 *
 * @param {Fn} fn
 * The function to curry.
 *
 * @returns {F.Curry<Fn>}
 * Returns the curried function.
 */
export const curryN = (n, fn) => curryF(
  n,
  (...xs) => xs.length >= n
    ? fn.apply(undefined, xs)
    : curryN(n - xs.length, (...ys) => fn.apply(undefined, xs.concat(ys)))
);

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
 * @template {F.Function} Fn
 * @param {Fn} fn
 * The function to curry.
 *
 * @returns {F.Curry<Fn>}
 * Returns the curried function.
 */
export const curry = fn => curryN(fn.length, fn);

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
 * @template {F.Function[]} Fns
 * @param {...F.Composer<Fns>} fns
 * The functions to compose from right to left.
 *
 * @returns {F.Curry<F.Composed<Fns>>}
 * Returns the new composed function.
 */
export const compose = (...fns) => {
  const fn = fns[fns.length - 1];
  return curryN(
    fn[curried] || fn.length,
    (...args) => fns
      .slice(0, -1)
      .reduceRight((x, fn) => fn(x), fn(...args))
  )
};

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
 * @template {F.Function[]} Fns
 * @param {...F.Piper<Fns>} fns
 * The functions to compose from right to left.
 *
 * @returns {F.Curry<F.Piped<Fns>>}
 * Returns the new composed function.
 */
export const pipe = (...fns) => {
  const fn = fns[0];
  return curryN(
    fn[curried] || fn.length,
    (...args) => fns
      .slice(1)
      .reduce((x, fn) => fn(x), fn(...args))
  )
};

/**
 * Flips arguments in reverse order of the specified function `f`.
 *
 * @example
 * const addl = curry((x, y) => x + y);
 * const addr = flip(addl);
 * addr("hello", "world");
 * // => "worldhello"
 *
 * @template {F.Function} Fn
 * @param {Fn} fn
 * The function to flip.
 *
 * @returns {F.Curry<(...args: L.Reverse<F.Parameters<Fn>>) => F.Return<Fn>>}
 * Returns the flipped function.
 */
export const flip = fn => curryN(
  fn[curried] || fn.length,
  (...args) => fn(...args.reverse())
)

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
 * @returns {(_: B) => A}
 * Returns the constant function.
 */
export const constant = x => _ => x;

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
 * @template A
 * @type {F.Curry<(p: (x: A) => boolean, f: (x: A) => A, r: A) => A>}
 * @param {(x: A) => boolean} p
 * The predicate always computed before `f`.
 *
 * @param {(x: A) => A} f
 * The function computed after the predicate `p` returned `false`.
 *
 * @param {A} x
 * The value to pass over the to the predicate `p` and the function `f`.
 */
export const until = curry((p, f, x) => {
  while (!p(x)) x = f(x);
  return x;
});
