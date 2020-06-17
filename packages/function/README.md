# `@prelude/function`

Simple combinators working solely on and with functions.

## Usage

### curry&lt;F extends Function&gt;(fn: F): Curry&lt;F&gt;

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
