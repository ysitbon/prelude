# Function

Simple combinators working solely on and with functions.

## Usage

#### identity(T) -> T

Identity function which returns the passed argument.

#### constant(A) -> (_) -> A

Creates a unary function which evaluates to `x` for all inputs.

```js
const fill = pipe(constant, map);
fill(42)(new Array(4));
// => [42, 42, 42, 42]
```

#### curry((...A) -> B) -> Curry<(...A) -> B> 

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

#### compose(...Function) -> Curry<Function>

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

#### pipe(...Function) -> Curry<Function>

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

#### flip((...A) -> B) -> Curry<(A...) -> B>

Flips the arguments in reverse order of a function. The created function's  
curried.

```js
const add = curry((x, y) => x + " " + y);
const addRight = flip(add);
addRight("hello", "world");
// => "world hello"
```

#### until((A) -> Boolean, (A) -> A, A) -> A

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
