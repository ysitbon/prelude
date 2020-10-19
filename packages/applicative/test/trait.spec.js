import {Applicative, apply, pure}    from "../index.js";
import {extension}                   from "@prelude/trait";
import {Functor}                     from "@prelude/functor";
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
  },
  [Applicative.pure](x) {
    return Identity(x);
  },
  [Applicative.apply](fx) {
    return this[Applicative.pure](this.value(fx.value));
  }
});

describe("@prelude/applicative", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("apply(fn: Applicative<((x: A) => B), scope: Applicative<A>): Applicative<B>", () => {
    const add = sinon.spy(x => x + 1);

    beforeEach(() => sandbox.spy(Identity.prototype, Applicative.apply));
    afterEach(() => add.resetHistory());

    it("should call the [Applicative.apply] symbol", () => {
      apply(new Identity(1), new Identity(add));
      expect(Identity.prototype[Applicative.apply]).to.have.been.calledOnce;
    });

    it("should call the function contained in the specified [Applicative]", () => {
      apply(new Identity(1), new Identity(add));
      expect(add).to.have.been.calledOnce;
    });

    it("should call the specified callback with the [Functor] value", () => {
      apply(new Identity(1), new Identity(add));
      expect(add).to.have.been.calledWith(1);
    });

    it("should returns the passed Functor with mapped value", () => {
      expect(apply(new Identity(1), new Identity(add)))
          .to.deep.equal(new Identity(2));
    });
  });

  describe("pure(F: Constructor<A>, value: T): Applicative<T>", () => {
    beforeEach(() => sandbox.spy(Identity.prototype, Applicative.pure));

    it("should call the [Applicative.pure] symbol", () => {
      pure(Identity, 1);
      expect(Identity.prototype[Applicative.pure]).to.have.been.calledOnce;
    });

    it("should box the passed value", () => {
      expect(pure(Identity, 1)).to.deep.equal(new Identity(1));
    });
  });
});
