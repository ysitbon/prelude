### `@prelude/function`

Simple combinators working solely on and with functions.

#### Identity

```ts
declare function identity<T>(x: T): T
```

Identity function. Returns the passed argument.

#### Constant

```ts
declare function constant<A, B>(x: A): ((_: B) => A)
```

Creates a unary function which evaluates to `x` for all inputs.

```js
const fill = pipe(constant, map);
fill(42)(new Array(4));
// => [42, 42, 42, 42]
```

#### Curry

```ts
declare function curry<F extends Function>(fn: F): Curry<F>
```

The passed function will be returns as a new function which can be partially 
applied automatically until all its arguments are consumed.

```js
import {curry} from "@prelude/function";

const addXYZ = curry((x, y, z) => x + y + z);

addXYZ(1, 2, 3) // -> 6
addXYZ(1)(2, 3) // -> 6
addXYZ(1)(2)(3) // -> 6
addXYZ(1, 2)(3) // -> 6
```

#### Compose

```ts
declare function compose<Fns extends Function[]>(...fns: Fns): Curry<Composed<Fns>>
```

Composes at least two functions from right to left and returns a new function. 
The new created function takes the same amount of arguments than the first 
composed function to call and is also curried.

```js
const fullName = compose(
   intersperse(" "),
   map(cap),
   props("firstName", "lastName")
);

getUser(1)
  .then(fullName)
  .then(console.log)
// => "John Doe"
```

#### Pipe

```ts
declare function compose<Fns extends Function[]>(...fns: Fns): Curry<Piped<Fns>>
```

Composes at least two functions from left to right and returns a new function. 
The new created function takes the same amount of arguments than the first 
composed function to call and is also curried.

```js
const fullName = pipe(
   props("firstName", "lastName"),
   map(cap),
   intersperse(" ")
);

getUser(1)
  .then(fullName)
  .then(console.log)
// => "John Doe"
```

#### Flip

```ts
declare function flip<Fn extends Function>(fn: Fn): F.Curry<(...args) => Return<Fn>>
```

Flips the arguments in reverse order of a function. The created function's  
curried.

```js
const add = curry((x, y) => x + " " + y);
const addRight = flip(add);
addRight("hello", "world");
// => "world hello"
```

#### Until

Calls the function `f` until the predicate `p` matches. Each time `f` is
computed, the returned value is used as the next input of `until` cycle.

```js
until(
  xs => head(xs) === 'c',
  xs => tail(xs),
  ['a', 'b', 'c', 'd']
)
// => ['c', 'd']
```