import {implement, protocol} from "../index.js";
import {expect} from "chai";

const sym1 = Symbol();
const sym2 = Symbol();

const Kind1 = protocol({sym1});
const Kind2 = protocol({sym2}, Kind1);

class Impl1 {
  [sym1]() {}
}

class Impl2 {
  [sym2]() {}
}

class Impl3 {
  [sym1]() {}
  [sym2]() {}
}

describe("@prelude/protocol", () => {
  it("protocol()", () => {
    expect(Kind1.sym1).to.equal(sym1);
    expect(Kind2.sym2).to.equal(sym2);
  });

  it("implement()", () => {
    expect(implement(Impl1.prototype, Kind2)).to.equal(false);
    expect(implement(Impl2.prototype, Kind2)).to.equal(false);
    expect(implement(Impl3.prototype, Kind2)).to.equal(true);
  });
});
