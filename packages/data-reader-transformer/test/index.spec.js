/*eslint-env mocha*/
import {map}                  from "@prelude/trait-functor";
import {apply}              from "@prelude/trait-applicative";
import {flatMap}              from "@prelude/trait-monad";
import {Identity}             from "@prelude/data-identity";
import {Maybe, Just}          from "@prelude/data-maybe";
import {getReaderT, runReaderT} from "../src/index.js";
import chai                   from "chai";

describe("@prelude/data-reader-transformer", () => {
  const {ReaderT, mapReaderT} = getReaderT(Identity);

  describe("mapReaderT", () => {
    it("do some stuff", () => {
      const reader = ReaderT(env => Identity(env));
      const readerFn = ReaderT(_ => Identity(x => x + 1));
      console.log(mapReaderT(Maybe, m => Just(m.value + 1))(reader).value(1));
      console.log(1 |> runReaderT(reader |> map(x => x + 1)));
      console.log(1 |> runReaderT(readerFn |> apply(reader)));
    });
  });
});
