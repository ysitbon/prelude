/*eslint-env mocha,es6*/
import {implement, trait, extension, deriving} from "../lib/index.js";
import chai                                    from "chai";
const {expect} = chai;

describe("@prelude/data-trait", () => {
  describe("trait(source, ...deriving)", () => {
    const key1 = Symbol();
    const key2 = Symbol();
    const Kind1 = trait({key1});
    const Kind2 = trait({[deriving]: [Kind1], key2});

    it("should copy symbols [source]", () =>
      expect(Kind1.key1).to.equal(key1));
    it("should contains [deriving] traits", () =>
      expect(Kind2[deriving]).to.deep.equal([Kind1]));
  });

  describe("implement(target, source)", () => {
    const key1 = Symbol();
    const key2 = Symbol();
    const Kind1 = trait({key1});
    const Kind2 = trait({[deriving]: [Kind1], key2});
    class Impl1 {
      [key1]() {}
    }
    class Impl2 {
      [key2]() {}
    }
    class Impl3 {
      [key1]() {} [key2]() {}
    }

    it("should return [false] if it does not implement " +
       "the [source] trait", () => {
      expect(Kind2 |> implement(Impl1.prototype)).to.equal(false);
    });

    it("should return [false] if it does not implement " +
       "the deriving [source] trait", () => {
      expect(Kind2 |> implement(Impl2.prototype)).to.equal(false);
    });

    it("should return [true] if it implements the [source] trait", () => {
      expect(Kind2 |> implement(Impl3.prototype)).to.equal(true);
    });
  });

  describe("extension(target: A, source: B): A & B", () => {
    // eslint-disable-next-line require-jsdoc
    function Target() {}
    const key1 = Symbol();
    const impl = extension(Target.prototype, {[key1]: true});

    it("should return the original target", () => {
      expect(impl).to.equal(Target.prototype);
    });

    it("should copy symbol key from source to target", () => {
      expect(key1 in impl).to.be.true;
    });

    it("should copy symbol value from source to target", () => {
      expect(impl[key1]).to.be.true;
    });
  });
});
