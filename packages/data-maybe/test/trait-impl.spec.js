/*eslint-env mocha*/
import {Maybe, Just, Nothing, isJust, isNothing, fromJust, fromMaybe,
  mapMaybe, catMaybes}  from "../lib/index.js";
import * as functor     from "@prelude/trait-functor/lib/trait-laws.js";
import * as applicative from "@prelude/trait-applicative/lib/trait-laws.js";
import * as monad       from "@prelude/trait-monad/lib/trait-laws.js";
import chai             from "chai";
const {expect} = chai;

describe("@prelude/data-maybe", () => {
  describe("isJust()", () => {
    it("should return [true] when [Just]", () => {
      expect(Just(1) |> isJust).to.be.true;
    });
    it("should return [false] when [Nothing]", () => {
      expect(Nothing() |> isJust).to.be.false;
    });
  });
  describe("isNothing()", () => {
    it("should return [true] when [Nothing]", () => {
      expect(Just(1) |> isNothing).to.be.false;
    });
    it("should return [false] when [Just]", () => {
      expect(Nothing() |> isNothing).to.be.true;
    });
  });
  describe("fromJust()", () => {
    it("should return inner [value] when [Just]", () => {
      expect(Just(1) |> fromJust).to.be.equal(1);
    });
    it("should throw when [Nothing]", () => {
      expect(() => Nothing() |> fromJust).to.throw();
    });
  });
  describe("fromMaybe(defaultValue)", () => {
    it("should return inner [value] when [Just]", () => {
      expect(Just(1) |> fromMaybe(0)).to.be.equal(1);
    });
    it("should return [defaultValue] when [Nothing]", () => {
      expect(Nothing() |> fromMaybe(0)).to.be.equal(0);
    });
  });
  describe("mapMaybes(fn, xs)", () => {
    it("should return an array containing only values " +
       "where [fn] returned [Just]", () => {
      const keepEven = x => 0 === (x % 2)
        ? Just(x)
        : Nothing();
      expect([1, 2, 3, 4] |> mapMaybe(keepEven))
        .to.be.deep.equal([2, 4]);
    });
  });
  describe("catMaybes(xs)", () => {
    it("should return an array containing only values " +
      "from [Just] elements", () => {
      expect([Nothing(), Just(2), Nothing(), Just(4)] |> catMaybes)
        .to.be.deep.equal([2, 4]);
    });
  });
  describe(
    "impl Maybe.prototype for @prelude/functor",
    () => functor.testLaw(Just(1))
  );
  describe(
    "impl Maybe.prototype for @prelude/applicative",
    () => applicative.testLaw(Maybe)
  );
  describe(
    "impl Maybe.prototype for @prelude/monad",
    () => monad.testLaw(Maybe)
  );
});
