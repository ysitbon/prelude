import chai      from "chai";
import {pure}    from "@prelude/applicative";
import {flatMap} from "../index.js";
const {expect} = chai;

export const testLaw = M => {
  it("Left identity: pure(x) |> flatMap(f) = f(x)", () => {
    const f = x => pure(M, x + 1);
    const x = 1;
    expect(flatMap(f, pure(M, x))).to.be.deep.equal(f(x));
  });

  it("Right identity: m |> flatMap(pure) = m", () => {
    const m = pure(M, 1);
    expect(flatMap(pure(M), m)).to.be.deep.equal(m);
  });

  it("Associativity: m |> flatMap(x => k(x) |> flatMap(h))" +
    " = (m |> flatMap(k)) |> flatMap(h)", () => {
    const m = pure(M, 1);
    const k = x => pure(M, x + 1);
    const h = x => pure(M, x * 2);
    expect(flatMap(x => flatMap(h, k(x)), m))
      .to.be.deep.equal(flatMap(h, flatMap(k, m)));
  });
}
