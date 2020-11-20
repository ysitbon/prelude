/** Keys which stored the trait deriving chain. */
export const deriving = Symbol("Trait.deriving");

/**
 * Creates a trait object.
 *
 * @template {Object} TObject
 * @param {TObject} descriptor
 * The trait descriptor.
 *
 * @returns {Trait<TObject>}
 * Returns the trait definition.
 */
export const trait = descriptor => ({
  [deriving]: (descriptor[deriving] || []) |> Object.freeze,
  ...descriptor
}) |> Object.freeze;

/**
 * Implements all the specified `protocols` to a give class `C`.
 *
 * @template TPrototype, TDesc
 * @param {Readonly<Object>} trait
 * The trait to implement.
 *
 * @param {TDesc} desc
 * The implementation descriptor.
 *
 * @returns {function(Constructor<TPrototype>): Constructor<TPrototype, TDesc>}
 * Returns the implemented constructor reference.
 */
export const impl = (trait, desc) => constructor =>
  trait[deriving].every(isImplFor(constructor.prototype))
  && Object
    .keys(trait)
    .reduce(
      (prototype, key) => desc |> isSymImpl(trait[key])
        ? implSymbol(desc, prototype, trait[key])
        : throwImplError(constructor, key),
      constructor.prototype
    );

/**
 * Checks that a given function `prototype` is implemented for the specified
 * `trait`, including all deriving.
 *
 * @template TPrototype, TObject
 * @param {TPrototype} prototype
 * The function prototype reference to validate.
 *
 * @returns {function(TObject): boolean}
 * Returns `true` if implemented, otherwise `false`.
 */
const isImplFor = prototype => trait => Object
  .keys(trait)
  .every(key => (prototype |> isSymImpl(trait[key]))
    || throwImplError(prototype.constructor, key)
  ) && trait[deriving].every(isImplFor(prototype));

/**
 * Checks that a `symbol` is implemented to the supplied `prototype` reference.
 *
 * @template TPrototype
 * @param {symbol} symbol
 * The symbol to check for implementation.
 *
 * @returns {function(TPrototype): boolean}
 * Returns `true` if the supplied symbol is implemented, otherwise `false`.
 */
const isSymImpl = symbol => prototype =>
  symbol in prototype && "function" === typeof prototype[symbol];

/**
 * Copies the definition of a trait symbol from a `desc` reference into the
 * supplied prototype reference.
 *
 * @template TPrototype, TDesc
 * @param {TDesc} desc
 * The descriptor object which contains the implementation definition.
 *
 * @param {TPrototype} prototype
 * The prototype object which receive the implementation.
 *
 * @param {symbol} symbol
 * The symbol to implement.
 *
 * @returns {Constructor<TPrototype & TDesc>}
 * Returns the updated `target` reference.
 */
const implSymbol = (desc, prototype, symbol) =>
  Object.defineProperty(prototype, symbol, readonly(desc[symbol]));

/**
 * Throws a trait implementation error.
 *
 * @throws
 * @param {Constructor<*>} target
 * The constructor which misses the trait implementation.
 *
 * @param {string} key
 * The unimplemented trait key.
 */
const throwImplError = (target, key) => {
  throw new Error(`Missing implementation of ${key} for ${target.name}`);
};

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
  configurable: true
});

/**
 * @template T
 * @typedef {function(...*): T} Constructor
 * Generic definition for function constructors
 */
