/*eslint-env node,mocha*/
import {map}                    from "@prelude/trait-functor";
import {apply, pure}            from "@prelude/trait-applicative";
import {flatMap}                from "@prelude/trait-monad";
import {Identity}               from "@prelude/data-identity";
import {Maybe, Just}            from "@prelude/data-maybe";
import {getReaderT, runReaderT} from "../src/index.js";
import assert                   from "assert";

describe("@prelude/data-reader-transformer", () => {
  const {ReaderT, mapReaderT, ask} = getReaderT(Identity);

  describe("mapReaderT", () => {
    it("[Functor.map]", () => {
      const reader = ReaderT(env => Identity(env));
      const result = 1 |> runReaderT(reader |> map(x => x + 1));

      assert.deepStrictEqual(Identity(2), result);
    });
    it("[Applicative.apply]", () => {
      const readerX = ReaderT(env => Identity(env));
      const readerF = ReaderT(_ => Identity(x => x + 1));
      const result = 1 |> runReaderT(readerF |> apply(readerX));

      assert.deepStrictEqual(Identity(2), result);
    });
    it("[Monad.flatMap]", () => {
      const reader = ReaderT(env => Identity(env))
        |> flatMap(x => (x + 1) |> pure(ReaderT));
      const result = 1 |> runReaderT(reader);

      assert.deepStrictEqual(Identity(2), result);
    });
    it("mapReaderT", () => {
      const reader = ReaderT(env => Identity(env));
      const result = 1
        |> runReaderT(reader |> mapReaderT(Maybe, m => Just(m.value)));

      assert.deepStrictEqual(Just(1), result);
    });
  });
});
