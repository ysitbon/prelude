# Identity monad

The `Identity` monad is a monad without any computational strategy. It just
applies functions to its input as is. It is mainly defined for its fundamental
role with monad transformers. Any monad transformer applied to the `Identity`
monad yields to a non-transformer version of that monad.

## Usage

See transformers source for `Identity` usage.

- [Reader transformer]
- [Writer transformer]
- [State transformer]

[Reader transformer]: https://github.com/ysaskia/prelude/tree/master/packages/data-reader-transformer#readme
[Writer transformer]: https://github.com/ysaskia/prelude/tree/master/packages/data-writer-transformer#readme
[State transformer]: https://github.com/ysaskia/prelude/tree/master/packages/data-state-transformer#readme
