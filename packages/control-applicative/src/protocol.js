import {protocol} from "@prelude/protocol";

const pure = Symbol("Applicative.pure");
const apply = Symbol("Applicative.apply");

export const Applicative = protocol({
  [deriving]: [Functor],
  pure,
  apply
});

/**
 * @template A
 * @param {A} mfn
 * @param {A} mx
 * @returns {A}
 */
export const apply = (mfn, mx) => mfn[apply](mx);

/**
 * @template A
 * @template T
 * @param {new (x: T) => A} Contructor
 * @param {T} x 
 * @returns {A}
 */
export const pure = (Contructor, x) => 
  Contructor.prototype[pure](x);

