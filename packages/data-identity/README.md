# Identity monad

The `Identity` monad is a monad that without any computational strategy. It just 
applies functions to its input without any additional modification. It is mainly 
defined for its fundamental role in the theory of monad transformers. Any monad 
transformer applied to the `Identity` monad yields to a non-transformer version 
of that monad.
 
## Usage

```js
import {Identity} from "@prelude/data-identity";
import {map}      from "@prelude/data-functor";

Identiy(1)
  |> map(x => x * 2)
  |> map(x => x + 1)
// => 3
```
