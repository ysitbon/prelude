# Maybe

The `Maybe<A>` type encapsulates an optional value. A value of type `Maybe<A>`
either contains a value of type `A`, represented as `Just<A>`, or it is
empty, represented as `Nothing`. Using `Maybe<A>` is a good way to deal with
errors or exceptional cases without resorting to drastic measures such
as error.
 
## Usage

```js
import {Maybe} from "@prelude/data-maybe";
import {pure}  from "@prelude/trait-applicative";
import {map}   from "@prelude/trait-functor";

const safeDiv = (x, y) => y === 0
  ? Nothing
  : (x / y) |> pure(Maybe);

safeDiv(NaN, 2);
// => Nothing
safeDiv(4, 0);
// => Nothing
safeDiv(4, 2);
// => Just(2)
```
