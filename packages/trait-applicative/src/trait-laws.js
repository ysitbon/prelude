/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {apply, pure}    from "../lib/index.js";
import chai             from "chai";
const {expect} = chai;

export const testLaw = A => {
  it("Identity", () => {
    const x = pure(A, 1);
    expect(apply(x, pure(A, identity))).to.be.deep.equal(x);
  });

  it("Composition", () => {
    const u = pure(A, x => x + 1);
    const v = pure(A, x => x * 2);
    const w = pure(A, 1);
    expect(pipe(apply(u), apply(v), apply(w))(pure(A, pipe)))
      .to.be.deep.equal(apply(apply(w, u), v));
  });

  it("Homomorphism", () => {
    const f = x => x + 1;
    const x = 1;
    expect(apply(pure(A, x), pure(A, f)))
      .to.be.deep.equal(pure(A, f(x)));
  });

  it("Interchange", () => {
    const u = pure(A, x => x + 1);
    const x = 1;
    expect(apply(pure(A, x), u))
      .to.be.deep.equal(apply(u, pure(A, f => f(x))));
  });
};
