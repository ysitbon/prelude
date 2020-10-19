import {curry, compose, identity, flip, constant, until, pipe} from "../index.js";
import chai from "chai";
const {expect} = chai;

describe("@prelude/function", () => {
  it("identity(x: A): A", () => {
    expect(identity("helloworld!")).to.equal("helloworld!");
  });

  it("curry(fn: Function): Curry<Function>)", () => {
    const sum = curry((x, y, z) => x + y + z);
    expect(sum("hello", "world", "!")).to.equal("helloworld!");
    expect(sum("hello")("world", "!")).to.equal("helloworld!");
    expect(sum("hello", "world")("!")).to.equal("helloworld!");
    expect(sum("hello")("world")("!")).to.equal("helloworld!");
  });

  describe("compose<Fns extend Function[]>(...fns: Fns): Curry<Composed<Fns>> ", () => {
    const f = x => x + '!';
    const g = y => y + 'world';

    it("should call specified functions from right to left", () => {
      const h = compose(f, g);
      expect(h('hello')).to.equal("helloworld!");
    });

    it("should auto-curry the 2 first arguments", () => {
      const h = compose(f);
      const i = h(g);
      expect(i('hello')).to.equal("helloworld!");
    });
  });

  describe("pipe<Fns extend Function[]>(...fns: Fns): Curry<Piped<Fns>> ", () => {
    const f = x => x + '!';
    const g = y => y + 'world';

    it("should call specified functions from left to right", () => {
      const h = pipe(g, f);
      expect(h('hello')).to.equal("helloworld!");
    });

    it("should auto-curry the 2 first arguments", () => {
      const h = pipe(g);
      const i = h(f);
      expect(i('hello')).to.equal("helloworld!");
    });
  });

  it("flip(fn: Function): Curry<ReversedParams<Function>>", () => {
    const f = (x, y) => x + y;
    const g = flip(f);
    expect(g("hello", "world")).to.equal("worldhello");
  });

  it("constant(x: A): (_: B) => A", () => {
    const f = constant("helloworld!");
    expect(f("goodbye!")).to.equal("helloworld!");
  });

  it("until(p: (x: A) => boolean, f: (x: A) => A, r: A)): A", () => {
    const f = until(
      cs => cs.charAt(0) === "h",
      cs => cs.slice(1)
    );
    expect(f("goodbye!helloworld!")).to.equal("helloworld!");
  });
});
