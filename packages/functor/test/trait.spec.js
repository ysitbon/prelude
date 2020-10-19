import chai                          from "chai";
import {spyFn, resetSpy, restoreSpy} from "@prelude/test-spies";
import {extension}                   from "@prelude/trait";
import {Functor, map, constMap}      from "../index.js";
const {expect} = chai;

function Identity(value) {
  if (undefined === new.target)
    return new Identity(value);
  else
    this.value = value;
}

extension(Identity.prototype, {
  [Functor.map](fn) {
    return Identity(fn(this.value));
  }
})

describe("@prelude/functor", () => {
  describe("map(fn: (x: A) => B, functor: F<A>): F<B>", () => {
    const [spy, add] = spyFn(x => x + 1);

    beforeEach(() => resetSpy(spy));

    it("should call the [Functor.map] symbol", () => {
      map(add, new Identity(1));
      expect(spy.called).to.be.true;
    });

    it("should call the [Functor.map] symbol with the Functor value", () => {
      map(add, new Identity(1));
      expect(spy.calls[0].args).to.deep.equal([1]);
    });

    it("should returns the passed Functor with mapped value", () => {
      map(add, new Identity(1));
      expect(map(x => x + 1, new Identity(1)).value).to.equal(2);
    });

    after(() => restoreSpy(spy));
  });

  describe("constMap(value: B, functor: F<A>): F<B>", () => {
    it("should returns the passed Functor containing the const value", () => {
      expect(constMap(2, new Identity(1)).value).to.equal(2)
    });
  });
});