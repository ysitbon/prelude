# Function

Simple combinators working solely on and with functions.

## Usage

#### identity()

Identity function which returns the passed argument.

#### constant()

Creates a unary function which evaluates to `x` for all inputs.

```js
import {constant} from "@prelude/data-function";

const trueFn = constant(true);
trueFn(false);
// => true
```

#### curry()

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

#### compose()

Composes at least two functions from right to left and returns a new function. 
The new created function takes the same amount of arguments than the first 
composed function to call and is also curried.

```js
import {compose, curry} from "@prelude/data-function";

const add = curry((x, y) => x + y);
const tpl = curry((str, val) => `${str}: ${val}`);
const incr = compose(
  tpl("Value"),
  add(1),
);
incr(1);
// => "Value: 2"
```

#### pipe()

Composes at least two functions from left to right and returns a new function. 
The new created function takes the same amount of arguments than the first 
composed function to call and is also curried.

```js
import {pipe, curry} from "@prelude/data-function";

const add = curry((x, y) => x + y);
const tpl = curry((str, val) => `${str}: ${val}`);
const incr = pipe(
  add(1),
  tpl("Value")
);
incr(1);
// => "Value: 2"
```

#### flip()

Flips the arguments in reverse order of a function. The created function's  
curried.

```js
import {flip} from "@prelude/data-function";

const addStr = (x, y) => x + " " + y;
const addStrRight = addStr |> flip;

addStrRight("hello", "world");
// => "world hello"
```

#### until()

Calls the function `f` until the predicate `p` matches. Each time `f` is
computed, the returned value is used as the next input of `until` cycle.

```js
import {until} from "@prelude/data-function";

['a', 'b', 'c', 'd']
  |> until(xs => xs[0] === 'c', ([_, ...xs]) => xs);
// => ['c', 'd']
```
