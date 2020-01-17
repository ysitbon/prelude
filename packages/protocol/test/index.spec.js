import {implement, protocol, extension, deriving} from "../index.js";
import {expect} from "chai";

describe("@prelude/protocol", () => {
  describe("protocol(source: A, ...deriving: Protocol<any>[]): Protocol<A>", () => {
    const symb1 = Symbol();
    const symb2 = Symbol();
    const Kind1 = protocol({symb1});
    const Kind2 = protocol({[deriving]: [Kind1], symb2});

    it("should copy symbols source", () => 
      expect(Kind1.symb1).to.equal(symb1));
    it("should contains deriving informations", () =>
      expect(Kind2[deriving]).to.deep.equal([Kind1]));
  });

  describe("implement(target: A, source: B): boolean", () => {
    const symb1 = Symbol();
    const symb2 = Symbol();
    const Kind1 = protocol({symb1});
    const Kind2 = protocol({[deriving]: [Kind1], symb2});
    class Impl1 { [symb1]() {} }
    class Impl2 { [symb2]() {} }
    class Impl3 { [symb1]() {} [symb2]() {} }

    it("should return false if does not implement source protocol", () => 
      expect(implement(Impl1.prototype, Kind2)).to.equal(false));
    it("should return false if does not implement deriving source protocol", () => 
      expect(implement(Impl2.prototype, Kind2)).to.equal(false));
    it("should return true if implement source protocol", () => 
      expect(implement(Impl3.prototype, Kind2)).to.equal(true));
  });

  describe("extension(target: A, source: B): A & B", () => {
    function Target() {}
    const symb = Symbol();
    const impl = extension(Target.prototype, {[symb]: true});

    it("should return the original target", () => 
      expect(impl).to.equal(Target.prototype));
    it("should copy symbol key from source to target", () => 
      expect(symb in impl).to.be.true);
    it("should copy symbol value from source to target", () => 
      expect(impl[symb]).to.be.true);
  });
});
