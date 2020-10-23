# Trait

This module aims to add a trait-like patterns to JavaScript like you can found 
in Rust, Swift, Haskell. Here, a trait is just a set of unique symbols which is 
supposed to be used later to check that a given trait implements these symbols 
as method members for a specific JS object. Since symbols are unique it allows 
multiple inheritance via the `deriving` symbol.

## Usage

For example it is how you can implement the `Functor` protocol

```js
// functor.js
import {trait, extension} from "@prelude/trait";

// Creates the Functor protocol definition.
export const Functor = trait({
  map: Symbol("Functor.map")
});

// Functor trait usage
export const map = (fn, functor) => functor[Functor.map](fn);

// Functor trait implementation for native JS Array
extension(Array.prototype, {
  [Functor.map](fn) {
    const xs = [];
    const ln = this.length;
    for (let i = 0; i < ln; ++i) xs.push(fn(this[i]));
    return xs;
  }
});
```

Deriving from `Functor` to create `Applicative` trait can be done like this:

```js
// applicative.js
import {trait, extension} from "@prelude/trait";
import {Functor}          from "./functor";
 
// Creates the Applicative protocol definition
export const Applicative = trait({
  [deriving]: [Functor],
  pure: Symbol("Applicative.pure"),
  apply: Symbol("Applicative.apply")
});

// Applicative trait usage
export const apply = (arg, fn) => fn[Applicative.apply](arg);
export const pure = (ApplicativeConstructor, x) => 
  ApplicativeConstructor.prototype[Applicative.pure](x);

// Applicative trait implementation for native JS Array
extension(Array.prototype, {
  [Applicative.pure](x) {
    return [x];
  },
  [Applicative.apply](xs) {
    return this[Functor.map]((fn, i) => fn(xs[i]));
  }
});
```

It is also possible to dynamically checks that an object implements a specified 
trait.

```js
import {implement}   from "@prelude/trait";
import {Applicative} from "@prelude/applicative";

const arr = [];
implement(arr, Applicative);
// -> true
```

