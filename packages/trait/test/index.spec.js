import {implement, trait, extension, deriving} from "../index.js";
import chai                                    from "chai";
const {expect} = chai;

describe("@prelude/trait", () => {
  describe("trait(source: A, ...deriving: Trait<any>[]): Trait<A>", () => {
    const key1 = Symbol();
    const key2 = Symbol();
    const Kind1 = trait({key1});
    const Kind2 = trait({[deriving]: [Kind1], key2});

    it("should copy symbols source", () => 
      expect(Kind1.key1).to.equal(key1));
    it("should contains deriving trait", () =>
      expect(Kind2[deriving]).to.deep.equal([Kind1]));
  });

  describe("implement(target: A, source: B): boolean", () => {
    const key1 = Symbol();
    const key2 = Symbol();
    const Kind1 = trait({key1});
    const Kind2 = trait({[deriving]: [Kind1], key2});
    class Impl1 { [key1]() {} }
    class Impl2 { [key2]() {} }
    class Impl3 { [key1]() {} [key2]() {} }

    it("should return false if does not implement source trait",
        () => expect(implement(Impl1.prototype, Kind2)).to.equal(false));
    it("should return false if does not implement deriving source trait",
        () => expect(implement(Impl2.prototype, Kind2)).to.equal(false));
    it("should return true if implement source trait",
        () => expect(implement(Impl3.prototype, Kind2)).to.equal(true));
  });

  describe("extension(target: A, source: B): A & B", () => {
    function Target() {}
    const key1 = Symbol();
    const impl = extension(Target.prototype, {[key1]: true});

    it("should return the original target",
        () => expect(impl).to.equal(Target.prototype));
    it("should copy symbol key from source to target",
        () => expect(key1 in impl).to.be.true);
    it("should copy symbol value from source to target",
        () => expect(impl[key1]).to.be.true);
  });
});
