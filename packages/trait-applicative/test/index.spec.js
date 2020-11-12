/*eslint-env mocha*/
import {Applicative, apply, pure} from "../lib/index.js";
import {extension}                from "@prelude/data-trait";
import {Functor}                  from "@prelude/trait-functor";
import chai                       from "chai";
import sinon                      from "sinon";
import sinonChai                  from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/trait-applicative", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("apply(functor, applicative)", () => {
    const add = sinon.spy(x => x + 1);
    const val = Identity(1);

    beforeEach(() => sandbox.spy(Identity.prototype, Applicative.apply));
    afterEach(() => add.resetHistory());

    it("should call the [Applicative.apply] symbol", () => {
      Identity(add) |> apply(val);
      expect(Identity.prototype[Applicative.apply])
        .to.have.been.calledOnce;
    });

    it( "should call the [applicative] inner function", () => {
      Identity(add) |> apply(val);
      expect(add).to.have.been.calledOnce;
    });

    it( "should call the [applicative] inner function " +
       "with inner [functor] value", () => {
      Identity(add) |> apply(val);
      expect(add).to.have.been.calledWith(1);
    });

    it( "should returns the computation result " +
       "wrapped into the input [Functor]", () => {
      expect(Identity(add) |> apply(val))
        .to.deep.equal(Identity(2));
    });
  });

  describe( "pure(FunctorConstructor, value)", () => {
    beforeEach(() => sandbox.spy(Identity.prototype, Applicative.pure));

    it("should call the [Applicative.pure] symbol", () => {
      1 |> pure(Identity);
      expect(Identity.prototype[Applicative.pure]).to.have.been.calledOnce;
    });

    it("should wrap the passed value into the input " +
       "[FunctorConstructor]", () => {
      expect(1 |> pure(Identity)).to.deep.equal(Identity(1));
    });
  });

  // eslint-disable-next-line require-jsdoc
  function Identity(value) {
    if (undefined === new.target)
      return new Identity(value);
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
});
