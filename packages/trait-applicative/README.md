# Applicative

A [Functor] with application. Instances of `Applicative` should satisfy the 
following laws:

- **Identity**
  ```js
  map(identity) === identity
  ```
- **Composition**
  ```js
  pipe |> pure(A) |> apply(u) |> apply(v) |> apply(w) === w |> apply(v |> apply(u))
  ```
- **Homomorphism**
  ```js
  f |> pure(A) |> apply(x |> pure(A)) === f(x) |> pure(A)
  ```
- **Interchange**
  ```js
  u |> apply(x |> pure(A)) === (f => f(x)) |> pure(A) |> apply(u)
  ```

[Functor]: https://github.com/ysaskia/prelude/tree/master/packages/trait-functor#readme

## Usage

```js
import {apply} from "@prelude/applicative";

const add = y => x => x + y;
[add(1), add(-1)] |> apply(new Array(2).fill(10));
// => [11, 9]
```
