/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {map}            from "./index.js";
import chai             from "chai";
const {expect} = chai;

export const testLaw = functor => {
  it("Identity", () => {
    expect(functor |> map(identity))
      .to.be.deep.equal(identity(functor));
  });

  it("Composition", () => {
    const add1 = x => x + 1;
    const mul2 = x => x * 2;
    expect(functor |> map(pipe(add1, mul2)))
      .to.be.deep.equal(functor |> map(add1) |> map(mul2));
  });
};
