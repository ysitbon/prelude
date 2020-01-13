import {expect}                 from "chai";
import {Spy}                    from "@prelude/test-spies";
import {extension}              from "@prelude/protocol";
import {Functor, map, constMap} from "../index.js";

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
  describe("map(fn: (x: A) => B, scope: F<A>): F<B>", () => {
    const spy = new Spy();
    const add = x => x + 1;

    before(() => spy.restore());

    it("should call the [Functor.map] symbol", () => {
      map(spy.on(add), new Identity(1));
      expect(spy.called).to.be.true;
    });

    it("should call the [Functor.map] symbol with the Functor value", () => {
      map(spy.on(add), new Identity(1));
      expect(spy.calls[0].args).to.deep.equal([1]);
    });

    it("should returns the passed Functor with mapped value", () => {
      map(add, new Identity(1));
      expect(map(x => x + 1, new Identity(1)).value).to.equal(2);
    });
  });

  describe("constMap(value: B, scope: F<A>): F<B>", () => {
    it("should returns the passed Functor containingthe const value", () => {
      expect(constMap(2, new Identity(1)).value).to.equal(2)
    });
  });

  describe("impl Array.prototype", () => {
    describe("map(fn: (x: A) => B, scope: Array<A>): Array<B>", () => {
      const spy = new Spy();
      const add = x => x + 1;

      before(() => spy.restore());

      it("should call the [Functor.map] symbol for each items", () => {
        map(spy.on(add), [1, 2, 3]);
        expect(spy.calls).to.deep.equal([
          {args:[1],returns:2},
          {args:[2],returns:3},
          {args:[3],returns:4}
        ]);
      });

      it("should returns a new array with the mapped values", () => {
        expect(map(add, [1, 2, 3])).to.deep.equal([2, 3, 4]);
      });
    });

    describe("constMap(value: B, scope: Array<A>): Array<B>", () => {
      it("should returns a new array with the passed value set for each items", () => {
        expect(constMap(4, [1, 2, 3])).to.deep.equal([4, 4, 4]);
      });
    });
  })
});