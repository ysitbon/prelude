import {trait, impl} from "@prelude/data-trait";

/**
 * The `Kind` defines data type identification.
 */
export const Species = trait({
  type: Symbol("Species.type")
});

/**
 * Gets the type symbol of `x`.
 *
 * @template {Species} S
 * @param {S} x
 * The value from which to get the type symbol.
 *
 * @returns {symbol}
 * Returns species type symbol.
 */
export const type = x => x[Species.type]();

/**
 * Default implementation of `Species` trait.
 *
 * @param {*} F
 * The constructor which will receive the implementation
 */
export const implSpecies = F => {
  const species = Symbol(`${F.name}.type`);
  F |> impl(Species, {
    [Species.type]() {
      return species;
    }
  });
};

String |> implSpecies;
Number |> implSpecies;
Boolean |> implSpecies;
