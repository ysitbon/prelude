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

#### compose()

Composes at two functions from right to left and returns a new function. 

```js
import {compose} from "@prelude/data-function";

const add = x => y => x + y;
const tpl = str => val => `${str}: ${val}`;
const incr = add(1) |> compose(tpl("Value"));
incr(1);
// => "Value: 2"
```

#### pipe()

Composes two functions from left to right and returns a new function. 

```js
import {pipe} from "@prelude/data-function";

const add = x => y => x + y;
const tpl = str => val => `${str}: ${val}`;
const incr = tpl("Value") |> pipe(add(1));
incr(1);
// => "Value: 2"
```

#### flip()

Flips the arguments in reverse order of a function. The created function's  
curried.

```js
import {flip} from "@prelude/data-function";

const addStr = y => x => x + " " + y;
const addStrRight = addStr |> flip;

"world" |> addStrRight("hello");
// => "hello world"
```

#### until()

Calls the function `f` until the predicate `p` matches. Each time `f` is
computed, the returned value is used as the next input of `until` cycle.

```js
import {until} from "@prelude/data-function";

['a', 'b', 'c', 'd']
  |> until(xs => xs[0] === 'c')(([_, ...xs]) => xs);
// => ['c', 'd']
```
