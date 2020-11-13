/*eslint-env mocha*/
import {extension}         from "@prelude/data-trait";
import {Semigroup, append} from "../lib/index.js";
import chai                from "chai";
import sinon               from "sinon";
import sinonChai           from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/trait-semigroup", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("append()", () => {
    beforeEach(() => sandbox.spy(List.prototype, Semigroup.append));

    it("should call the [Semigroup.append] symbol", () => {
      List(1, 2, 3) |> append(List(4, 5, 6));
      expect(List.prototype[Semigroup.append]).to.have.been.calledOnce;
    });

    it("should returns the results of the associativity", () => {
      expect(List(1, 2, 3) |> append(List(4, 5, 6)))
        .to.deep.equal(List(1, 2, 3, 4, 5, 6));
    });
  });

  // eslint-disable-next-line require-jsdoc
  function List(...values) {
    if (undefined === new.target)
      return new List(...values);
    else {
      this.values = [...values];
    }
  }

  extension(List.prototype, {
    [Semigroup.append](list) {
      return List(...this.values, ...list.values);
    }
  });
});
