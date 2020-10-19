import {extension}      from "@prelude/trait";
import {Functor}        from "@prelude/functor";
import {Applicative, apply} from "@prelude/applicative";
import {Monad, flatMap} from "../index.js";
import chai             from "chai";
import sinon            from "sinon";
import sinonChai        from "sinon-chai";
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
  },
  [Monad.flatMap](fn) {
    return fn(this.value);
  }
})

describe("@prelude/monad", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("flapMap(fn: (x: A) => F<B>, functor: F<A>): F<B>", () => {
    const add = sinon.spy(x => Identity(x + 1));

    beforeEach(() => sandbox.spy(Identity.prototype, Monad.flatMap));
    afterEach(() => add.resetHistory());

    it("should call the [Monad.flatMap] symbol", () => {
      flatMap(add, new Identity(1));
      expect(Identity.prototype[Monad.flatMap]).to.have.been.calledOnce;
    });

    it("should call the specified callback function", () => {
      flatMap(add, new Identity(1));
      expect(add).to.have.been.calledOnce;
    });

    it("should call the [Monad.flatMap] symbol with the Monad value", () => {
      flatMap(add, new Identity(1));
      expect(add).to.have.been.calledWith(1);
    });

    it("should returns the passed Monad with the mapped value", () => {
      expect(flatMap(add, new Identity(1)).value).to.equal(2);
    });
  });
});
