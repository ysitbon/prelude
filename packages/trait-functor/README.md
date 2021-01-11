# Functor

A `Functor` represents a type that can be mapped over with a `map` function.
Instances of `Functor` should satisfy the following laws:

- **Identity**
  ```js
  map(identity) === identity
  ```
- **Composition**
  ```js
  map(f |> pipe(g)) === map(f) |> pipe(map(g))
  ```

This package also provides the `Functor` implementation for native `Array`
instances.

## Usage

#### map :: Functor F => (a -> b) -> F a -> F b

Maps all elements of the input `Functor`.

```js
import {map} from "@prelude/functor";

[1, 2] |> map(x => x + 1);
// => [2, 3]
```

#### constMap :: Functor F => b -> F a -> F b

Replace all elements of the input `Functor` with the same value.

```js
import {constMap} from "@prelude/functor";

[1, 2] |> constMap(3);
// => [3, 3]
```
