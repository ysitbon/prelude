/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {map}            from "./index.js";
import assert           from "assert";

export const testLaw = functor => {
  it("Identity", () => {
    assert.deepStrictEqual(
      functor |> map(identity),
      identity(functor)
    );
  });

  it("Composition", () => {
    const add1 = x => x + 1;
    const mul2 = x => x * 2;
    assert.deepStrictEqual(
      functor |> map(mul2 |> pipe(add1)),
      functor |> map(add1) |> map(mul2)
    );
  });
};
