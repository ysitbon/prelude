import {curry} from "@prelude/function";

/** Keys which stored the protocol deriving chain. */
export const deriving = Symbol("Protocol.deriving");

/**
 * Creates a protocol object.
 *
 * @template T,U
 * @param {T} descriptor
 * @param {...U} deriving
 * @returns {T};
 */
export const protocol = descriptor => Object.freeze({
  [deriving]: Object.freeze(protocol[deriving] || []),
  ...descriptor
});

/**
 * Implements all the specified `protocols` to a give class `C`.
 *
 * @template a
 * @param {a} x
 * @param {b} p
 * @returns {boolean}
 */
export const implement = curry((x, p) => Object
    .keys(p)
    .every(k => p[k] in x && typeof x[p[k]] === "function")
  && p[deriving].every(implement(x))
);

/**
 * Extension enable to add members to an existing type without creating
 * a new derived type.
 *
 * @template a, b
 * @param {a} target
 * The target object to extend.
 *
 * @param {b} source
 * The source object which extend the target.
 *
 * @returns {a & b}
 * Returns the extended target object.
 */
export const extension = (target, source) => Object
  .getOwnPropertySymbols(source)
  .reduce(
    (target, property) => Object.defineProperty(
      target, 
      property, 
      readonly(source[property])),
    (target)
  );

/**
 * Creates writable property descriptor for object `x`.
 *
 * @template a
 * @param {a} value
 * The object to used as value.
 *
 * @returns {PropertyDescriptor}
 * Returns the new property descriptor object.
 */
const readonly = value => ({
  value,
  writable: false,
  enumerable: true,
  configurable: false
});
