[Functor]: https://github.com/ysaskia/prelude/tree/master/packages/trait-functor#readme
[Applicative]: https://github.com/ysaskia/prelude/tree/master/packages/trait-applicative#readme
[Monad]: https://github.com/ysaskia/prelude/tree/master/packages/trait-monnad#readme

# Maybe

The `Maybe<A>` type encapsulates an optional value. A value of type `Maybe<A>`
either contains a value of type `A`, represented as `Just<A>`, or it is empty,
represented as `Nothing`. Using `Maybe<A>` is a good way to avoid working with
`undefined` or `null` values. It avoids dealing with errors or exceptional
cases without resorting to drastic measures such as error.

`Just<A>` does not accept `null`, `undefined` or `NaN` values. The `Maybe<A>`
type implements the [Monad] trait.

## Usage

#### (Functor) map:: `(A -> B) -> Maybe<A> -> Maybe<B>`

The [Functor] `map` implementation of a `Maybe<A>` only map its element, only
if it's a `Just<A>` otherwise it returns `Nothing`. Additionally, if the value
returned by the function argument is `undefined`, `null` or `NaN` it returns
`Nothing`.

```js
import {isJust} from "@prelude/data-maybe";
import {map}    from "@prelude/trait-functor";

Just(1) |> map(x => x + 1)
// -> Just(2)
null |> map(x => x + 1)
// -> Nothing
Just(1) |> map(_ => NaN)
// -> Nothing
```

#### (Applicative) pure:: `A -> Maybe -> Maybe<A>`

Lift an `A` value into a `Maybe<A>`. If the `A` is `NaN`, `null` or `undefined`,
returns `Nothing`.

```js
import {isJust} from "@prelude/data-maybe";
import {pure}   from "@prelude/trait-applicative";

1 |> pure(Maybe)
// -> Just(1)
NaN |> pure(Maybe)
// -> Nothing
null |> pure(Maybe)
// -> Nothing
undefined |> pure(Maybe)
// -> Nothing
```

#### (Applicative) apply:: `Maybe<A> -> Maybe<A -> B> -> Maybe<B>`

The [Applicative] `apply` implementation of a `Maybe<A>` only process function
application if both values are `Just` otherwise it returns `Nothing`.
Additionally, if the value returned by the function application is `undefined`,
`null` or `NaN` it returns `Nothing`.

```js
import {isJust} from "@prelude/data-maybe";
import {apply}  from "@prelude/trait-applicative";

Just(x => x + 1) |> apply(Just(1))
// -> Just(2)
Just(x => x + 1) |> apply(Nothing)
// -> Nothing
Just(Nothing) |> apply(Just(1))
// -> Nothing
Just(_ => NaN) |> apply(Just(1))
// -> Nothing
```

#### (Monad) flatMap:: `(A -> Maybe<B>) -> Maybe<A> -> Maybe<B>`

The [Monad] `flatMap` implementation of a `Maybe<A>` compute an action resulting
into another `Maybe<B>`.

```js
import {isJust}  from "@prelude/data-maybe";
import {flatMap} from "@prelude/trait-monad";

const formatPair = 0 === n % 2
  ? Just("0" + n + ":00")
  : Nothing()

Just(1) |> flatMap(formatPair)
// -> Nothing
Just(2) |> flatMap(formatPair)
// -> Just("02:00")
```

#### isJust :: `Maybe<A> -> boolean`

Checks that an instance of `Maybe<A>` is `Just<A>`.

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

#### isNothing :: `Maybe<A> -> boolean`

Checks that an instance of `Maybe<A>` is `Nothing`.

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

#### fromJust :: `Maybe<A> -> A`

Extracts the element `a` out of a `Just<A>` and throws an error if its
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

#### fromMaybe :: `A -> Maybe<A> -> A`

Extracts the element `a` out of a `Maybe a` reference. If is `Nothing` returns
the supplied `defaultValue`.

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

#### mapMaybe :: `(A -> Maybe<B>) -> Maybe<A>[] -> B[]`

The `mapMaybe` function is a version of `map` which can throw out elements. In
particular, the supplied function returns something of type `Maybe<b>`. If this
is `Nothing`, no element is added on to the result array. If it is `Just<B>`,
then `B` is included in the result array.


```js
import {mapMaybe} from "@prelude/data-maybe";

[1, 2, 3, 4, 5] |> mapMaybe(n => 0 === n % 2
  ? Just("0" + n + ":00")
  : Nothing()
)
// -> ["02:00","04:00"]
```

#### catMaybes :: `Maybe<A>[] -> A[]`

Takes an array of `Maybe<A>` and returns an array of all the `Just<A>` values.

```js
import {catMaybes} from "@prelude/data-maybe";

[Just(1), Nothing, Just(3), Nothing] |> catMaybes
// -> [1, 3]
```
