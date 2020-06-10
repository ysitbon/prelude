# `@prelude/function`

Simple combinators working solely on and with functions.

## Usage

```js
import {curry} from "@prelude/function";

const add = curry((x, y) => x + y);
[1, 8, 9].map(add(1));
// -> [2, 9, 10]
```
