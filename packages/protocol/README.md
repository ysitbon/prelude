# `@prelude/protocol`

This module aims to add a protocol-like patterns to JavaScript like you can found in Swift, Rust, Haskell. Here, a protocol is just a set of unique symbols which is supposed to be used later to check that a given protocol is implemented for a JS object. Since symbols are unique it also allow multiple inheritance via the `deriving` symbol.

## Usage

For example it is how you can implement the `Functor` protocol

```js
// functor.js
import {protocol, extension} from "@prelude/protocol";

// Creates the Functor protocol definition.
export const Functor = protocol({
  map: Symbol("Functor.map")
});

// Functor protocol usage
export const map = (fn, functor) => functor[Functor.map](fn);

// Functor protocol implementation for native JS Array
extension(Array.prototype, {
  [Functor.map](fn) {
    const xs = [];
    const ln = this.length;
    for (let i = 0; i < ln; ++i) xs.push(fn(this[i]));
    return xs;
  }
});
```

Deriving from `Functor` to create `Applicative` protocol can be done like this:

```js
// applicative.js
import {protocol} from "@prelude/protocol";
import {Functor}  from "./functor";
 
// Creates the Applicative protocol definition
export const Applicative = protocol({
  [deriving]: [Functor],
  pure: Symbol("Applicative.pure"),
  apply: Symbol("Applicative.apply")
});

// Applicative protocol usage
export const apply = curry((arg, fn) => fn[Applicative.apply](arg));
export const pure = curry((ApplicativeConstructor, x) =>
  ApplicativeConstructor.prototype[Applicative.pure](x));

// Applicative protocol implementation for native JS Array
extension(Array.prototype, {
  [Applicative.pure](x) {
    return [x];
  },
  [Applicative.apply](xs) {
    return this[Functor.map]((fn, i) => fn(xs[i]));
  }
});
```

It is also possible to dynamically checks that an object implements a specified protocol.

```js
import {Applicative} from "@prelude/applicative";

const arr = [];
implement(arr, Applicative);
// -> true
```

