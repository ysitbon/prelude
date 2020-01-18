import {protocol, deriving} from "@prelude/protocol";
import {Functor} from "@prelude/functor";

const $pure  = Symbol("Applicative.pure");
const $apply = Symbol("Applicative.apply");

export const Applicative = protocol({
  [deriving]: [Functor],
  pure: $pure,
  apply: $apply
});

/**
 * @template A
 * @param {A} afn
 * @param {A} ax
 * @returns {A}
 */
export const apply = (afn, ax) => afn[$apply](ax);

/**
 * @template A
 * @template T
 * @param {new (x: T) => A} Ctor
 * @param {T} x
 * @returns {A}
 */
export const pure = (Ctor, x) => 
  Ctor.prototype[$pure](x);

