import {extension}                   from "@prelude/trait";
import {Functor, map, constMap}      from "../index.js";
import chai                          from "chai";
import sinon                         from "sinon";
import sinonChai                     from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

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
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("map(fn: (x: A) => B, functor: F<A>): F<B>", () => {
    const add  = sinon.spy(x => x + 1);

    beforeEach(() => sandbox.spy(Identity.prototype, Functor.map));

    it("should call the [Functor.map] symbol", () => {
      map(add, new Identity(1));
      expect(Identity.prototype[Functor.map]).to.have.been.calledOnce;
    });

    it("should call the specified callback", () => {
      map(add, new Identity(1));
      expect(add).to.have.been.calledOnce;
    });

    it("should call the specified callback with the Functor value", () => {
      map(add, new Identity(1));
      expect(add).to.have.been.calledOnceWith(1);
    });

    it("should returns the passed Functor with mapped value", () => {
      map(add, new Identity(1));
      expect(map(x => x + 1, new Identity(1)).value).to.equal(2);
    });

    afterEach(() => add.resetHistory());
  });

  describe("constMap(value: B, functor: F<A>): F<B>", () => {
    it("should returns the passed Functor containing the const value", () => {
      expect(constMap(2, new Identity(1)).value).to.equal(2);
    });
  });
});