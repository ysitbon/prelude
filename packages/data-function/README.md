# Function

Simple combinators working solely on and with functions.

## Usage

#### identity :: a

Identity function which returns the passed argument.

```js
import {constant} from "@prelude/data-function";

identity(1) === 1;
// => true
```

#### constant :: a -> _ -> a

Creates a unary function which evaluates to `x` for all inputs.

```js
import {constant} from "@prelude/data-function";

const trueFn = constant(true);
trueFn(false);
// => true
```

#### compose :: () -> () -> c

Composes two functions from right to left.

```js
const greet = str => `Hello, ${str}`;
const exclaim = str => `${str}!`;
const greetings = exclaim |> compose(greet);

greetings("Yoann");
// -> Hello, Yoann!
```

#### pipe()

Composes two functions from left to right.

```js
const greet = str => `Hello, ${str}`;
const exclaim = str => `${str}!`;
const greetings = greet |> compose(exclaim);

greetings("Yoann");
// -> Hello, Yoann!
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
