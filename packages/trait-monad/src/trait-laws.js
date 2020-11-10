/*eslint-env mocha*/
import chai      from "chai";
import {pure}    from "@prelude/trait-applicative";
import {flatMap} from "../lib/index.js";
const {expect} = chai;

export const testLaw = M => {
  it("Left identity", () => {
    const f = x => (x + 1) |> pure(M);
    const x = 1;
    expect(x |> pure(M) |> flatMap(f)).to.be.deep.equal(f(x));
  });

  it("Right identity", () => {
    const m = 1 |> pure(M);
    expect(m |> flatMap(pure(M))).to.be.deep.equal(m);
  });

  it("Associativity", () => {
    const m = 1 |> pure(M);
    const k = x => (x + 1) |> pure(M);
    const h = x => (x * 2) |> pure(M);
    expect(m |> flatMap(x => k(x) |> flatMap(h)))
      .to.be.deep.equal(m |> flatMap(k) |> flatMap(h));
  });
};
