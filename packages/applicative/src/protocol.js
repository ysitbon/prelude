import {protocol, deriving} from "@prelude/protocol";
import {Functor} from "@prelude/functor";

export const Applicative = protocol({
  [deriving]: [Functor],
  pure: Symbol("Applicative.pure"),
  apply: Symbol("Applicative.apply")
});

export const apply = (functor, applicative) =>
    applicative[Applicative.apply](functor);

export const pure = (ApplicativeConstructor, x) =>
    ApplicativeConstructor.prototype[Applicative.pure](x);
