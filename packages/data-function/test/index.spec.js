/*eslint-env mocha*/
import {compose, identity,
  flip, constant, until, pipe} from "../src/index.js";
import chai from "chai";
const {expect} = chai;

describe("@prelude/function", () => {
  describe("identity(value)", () => {
    it("should returns the passed [value]", () => {
      expect(identity("hello world!")).to.equal("hello world!");
    });
  });

  describe("compose(...fns)", () => {
    const f = x => `${x}!`;
    const g = y => `${y} world`;

    it("should call composed [fns] from right to left", () => {
      const h = compose(f)(g);
      expect(h('hello')).to.equal("hello world!");
    });

    it("should be curried for the 2 first [fns] arguments", () => {
      const h = compose(f);
      const i = h(g);
      expect(i('hello')).to.equal("hello world!");
    });
  });

  describe("pipe(...fns)", () => {
    /**
     * @template A
     * @param {A} x
     * @return {string}
     */
    const f = x => `${x}!`;
    /**
     * @template A
     * @param {*} y
     * @return {string}
     */
    const g = y => `${y} world`;

    it("should call piped [fns] from left to right", () => {
      const h = pipe(g)(f);
      expect(h('hello')).to.equal("hello world!");
    });

    it("should be curried for the 2 first [fns] arguments", () => {
      const h = pipe(g);
      const i = h(f);
      expect(i('hello')).to.equal("hello world!");
    });
  });

  describe("flip(fn)", () => {
    it("should copy the input [fn] with its arguments reversed", () => {
      const f = x => y => `${x} ${y}`;
      const g = flip(f);
      expect(g("world")("hello")).to.equal("hello world");
    });
  });

  describe("constant(x)", () => {
    it("should returns a function returning the input value", () => {
      const f = constant("hello world!");
      expect(f("goodbye!")).to.equal("hello world!");
    });
  });

  describe("until(p, f, r)", () => {
    it("should call [f] and [p] until [p] is not true", () => {
      const value = until(cs => cs.charAt(0) === "h")
                         (cs => cs.slice(1))
                         ("goodbye!hello world!");
      expect(value).to.equal("hello world!");
    });
  });
});
