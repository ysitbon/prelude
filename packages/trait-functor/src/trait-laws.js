/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {map}            from "./index.js";
import assert           from "assert";

export const testLaw = functor => {
  const eq = (x, y) => x === y;

  it("Identity", () => {
    assert.ok(eq(
      functor |> map(identity),
      identity(functor)
    ));
  });

  it("Composition", () => {
    const add1 = x => x + 1;
    const mul2 = x => x * 2;
    assert.ok(eq(
      functor |> map(pipe(add1, mul2)),
      functor |> map(add1) |> map(mul2)
    ));
  });
};
