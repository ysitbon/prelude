# Maybe

The `Maybe<A>` type encapsulates an optional value. A value of type `Maybe<A>`
either contains a value of type `A`, represented as `Just<A>`, or it is empty,
represented as `Nothing`. Using `Maybe<A>` is a good way to avoid working with
`undefined` or `null` values. It avoids dealing with errors or exceptional
cases without resorting to drastic measures such as error.

`Just<A>` does not accept `null`, `undefined` or `NaN` values. The `Maybe<A>`
type implements the [Monad] trait.

## Usage


#### isJust :: Maybe a -> bool

Checks that a instance of `Maybe` is `Just<A>`.

```js
import {isJust} from "@prelude/data-maybe";
import {pure}   from "@prelude/trait-applicative";

null
  |> pure(Maybe)
  |> isJust
// -> false
"Hello world"
  |> pure(Maybe)
  |> isJust
// -> true
```

#### isNothing :: Maybe a -> bool

Checks that a instance of `Maybe` is `Nothing`.

```js
import {isNothing} from "@prelude/data-maybe";
import {pure}      from "@prelude/trait-applicative";

null
  |> pure(Maybe)
  |> isNothing
// -> true
"Hello world"
  |> pure(Maybe)
  |> isNothing
// -> false
```

#### fromJust :: Maybe a -> a

Extracts the element `a` out of a `Just a` and throws an error if its
argument is Nothing.

```js
import {fromJust} from "@prelude/data-maybe";
import {pure}     from "@prelude/trait-applicative";

"Hello world"
  |> pure(Maybe)
  |> fromJust
// -> "Hello world"
null
  |> pure(Maybe)
  |> fromJust
// -> Throws: Error("Nothing cannot be converted to any value")
```

#### fromMaybe :: a -> Maybe a -> a

Extracts the element out of a `Maybe` reference. Returns the `defaultValue` if
`maybe` is `Nothing`.

```js
import {fromMaybe} from "@prelude/data-maybe";
import {pure}      from "@prelude/trait-applicative";

"Hello world"
  |> pure(Maybe)
  |> fromMaybe("Nothing to say")
// -> "Hello world"
null
  |> pure(Maybe)
  |> fromMaybe("Nothing to say")
// -> "Nothing to say"
```

[Monad]: https://github.com/ysaskia/prelude/tree/master/packages/trait-monad#readme
