/** Symbols to use functions to store current curried arity */
const curried = Symbol("Function.curried");

/**
 * Attaches `Function.curried` symbol which stores the arguments length
 * currently curried. It is mainly used to retrieve this information when
 * implementing function which acts on other function and want to preserve
 * auto-currying capability. See {@link compose} or {@link pipe} source
 * for custom implementation examples.
 *
 * @template {import("ts-toolbelt").Function} Fn
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
 * @template {import("ts-toolbelt").Function} Fn
 * @param {number} n
 * Arity of the function to curry.
 *
 * @param {Fn} fn
 * The function to curry.
 *
 * @returns {Curry<Fn>}
 * Returns the curried function.
 */
const curryN = (n, fn) => curryF(
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
 * @template {import("ts-toolbelt").Function} Fn
 * @param {Fn} fn
 * The function to curry.
 *
 * @returns {Curry<Fn>}
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
 * @template {import("ts-toolbelt").Function} Fn
 * @template {Fn[]} Fns
 * @param f
 * @param g
 * @param {...Composer<Fns>} otherFns
 * The functions to compose from right to left.
 *
 * @returns {Curry<Composed<Fns>>}
 * Returns the new composed function.
 */
const compose_ = (f, g, ...otherFns) => {
  const fns = [f, g, ...otherFns];
  const lastFn = fns[fns.length - 1];
  const calls = fns.slice(0, -1);
  return curryN(
    lastFn[curried] || lastFn.length,
    (...args) => calls.reduceRight((x, call) => call(x), lastFn(...args))
  );
};

/** @inheritDoc compose_ */
export const compose = curry(compose_);

/**
 * Composes at least two functions from left to right and returns a new
 * function. The new created function takes the same amount of arguments
 * than the first composed function to call and is also curried.
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
 * @template {import("ts-toolbelt").Function} Fn
 * @template {Fn[]} Fns
 * @param f
 * @param g
 * @param {...Piper<Fns>} otherFns
 * The functions to compose from right to left.
 *
 * @returns {Curry<Piped<Fns>>}
 * Returns the new composed function.
 */
const pipe_ = (f, g, ...otherFns) => {
  const calls = [g, ...otherFns];
  return curryN(
    f[curried] || f.length,
    (...args) => calls.reduce((x, call) => call(x), f(...args))
  );
};

/**@inheritDoc pipe_*/
export const pipe = curry(pipe_);

/**
 * Flips the arguments in reverse order of the specified function `f`. The
 * created function is curried.
 *
 * @example
 * const add = curry((x, y) => x + " " + y);
 * const addRight = flip(add);
 * addRight("hello", "world");
 * // => "world hello"
 *
 * @template {import("ts-toolbelt").Function} Fn
 * @param {Fn} fn
 * The function to flip.
 *
 * @returns {Curry<function(...args: Reverse<Parameters<Fn>>): Return<Fn>>}
 * Returns the flipped function.
 */
export const flip = fn => curryN(
  fn[curried] || fn.length,
  (...args) => fn(...args.reverse())
);

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
 * @returns {function(_: B): A}
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
 * @param {function(A): boolean} p
 * The predicate always computed before `f`.
 *
 * @param {function(A): A} f
 * The function computed after the predicate `p` returned `false`.
 *
 * @param {A} x
 * The value to pass over the to the predicate `p` and the function `f`.
 */
const until_ = (p, f, x) => {
  let curr = x;
  while (!p(curr)) curr = f(curr);
  return curr;
};

/**@inheritDoc until_*/
export const until = curry(until_);
