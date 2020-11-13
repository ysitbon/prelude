/*eslint-env mocha*/
import {extension}      from "@prelude/data-trait";
import {Functor}        from "@prelude/trait-functor";
import {Applicative}    from "@prelude/trait-applicative";
import {Monad, flatMap} from "../src/index.js";
import {testLaw}        from "../src/trait-laws.js";
import chai             from "chai";
import sinon            from "sinon";
import sinonChai        from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/trait-monad", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("flapMap(fn, monad)", () => {
    const add = sinon.spy(x => Identity(x + 1));

    beforeEach(() => sandbox.spy(Identity.prototype, Monad.flatMap));
    afterEach(() => add.resetHistory());

    it("should call the [Monad.flatMap] symbol", () => {
      Identity(1) |> flatMap(add);
      expect(Identity.prototype[Monad.flatMap]).to.have.been.calledOnce;
    });

    it("should call [fn]", () => {
      Identity(1) |> flatMap(add);
      expect(add).to.have.been.calledOnce;
    });

    it("should call [fn] with inner [monad] value", () => {
      Identity(1) |> flatMap(add);
      expect(add).to.have.been.calledWith(1);
    });

    it("should returns the computation result " +
       "wrapped into the input [Monad]", () => {
      const result = Identity(1) |> flatMap(add);
      expect(result.value).to.equal(2);
    });
  });

  describe(
    "impl Array.prototype for @prelude/trait-monad",
    () => testLaw(Array)
  );

  // eslint-disable-next-line require-jsdoc
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
  });
});
