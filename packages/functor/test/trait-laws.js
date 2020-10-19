import chai             from "chai";
import {identity, pipe} from "@prelude/function";
import {map}            from "../index.js";
const {expect} = chai;

export const testLaw = functor => {
  it("identity: map(id) = id", () => {
    expect(map(identity, functor)).to.be.deep.equal(identity(functor))
  });

  it("composition: map(pipe(f, g)) == pipe(map(f), map(g))", () => {
    const add1 = x => x + 1;
    const mul2 = x => x * 2;
    expect(map(pipe(add1, mul2), functor))
      .to.be.deep.equal(pipe(map(add1), map(mul2))(functor));
  });
}
