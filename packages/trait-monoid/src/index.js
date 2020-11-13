import {Semigroup}       from "@prelude/trait-semigroup";
import {trait, deriving} from "@prelude/data-trait";

/**
 * Empty representation of any type like `0` being the empty value of `Number`
 * or `[]` being the empty representation of an `Array` reference. Monoid must
 * implement {@link Semigroup}.
 */
export const Monoid = trait({
  [deriving]: [Semigroup],
  empty: Symbol("Monoid.empty")
});

/**
 *
 */
export const empty = M => M.prototype[Monoid.empty]();

