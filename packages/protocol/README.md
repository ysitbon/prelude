# `@prelude/protocol`

This module aims to add a protocol-like patterns to JavaScript like you can found in Swift, Rust, Haskell. Here, a protocol is just a set of unique symbols which is supposed to be used later to check that a given protocol is implemented for a JS object. Since symbols are unique it also allow multiple inheritance via the `deriving` symbol.

## Usage

For example it is how you can implement the `Functor` protocol

```js
// functor.js
import {protocol} from "@prelude/protocol";

/** Creates the Functor protocol definition */
export const Functor = protocol({
  map: Symbol("Functor.map")
});

/**
 * @template {Functor} F
 * @template A, B
 * @param {function(A): B} fn
 * @param {F<A>} functor
 * @return {F<B>}
 */
export const map = curry((fn, functor) => functor[Functor.map](fn));
```
