/*eslint-env mocha*/
import {compose, identity,
  flip, constant, until, pipe} from "../lib/index.js";
import chai from "chai";
const {expect} = chai;

describe("@prelude/data-function", () => {
  describe("identity(value)", () => {
    it("should returns the passed [value]", () => {
      expect(identity("hello world!")).to.equal("hello world!");
    });
  });

  describe("compose :: () -> () -> ", () => {
    const f = y => `${y} world`;
    const g = x => `${x}!`;

    it("should call composed [fns] from right to left", () => {
      const h = g |> compose(f);
      expect(h('hello')).to.equal("hello world!");
    });
  });

  describe("pipe(...fns)", () => {
    const g = y => `${y} world`;
    const f = x => `${x}!`;

    it("should call piped [fns] from left to right", () => {
      const h = g |> pipe(f);
      expect(h('hello')).to.equal("hello world!");
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
