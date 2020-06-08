import {F} from "ts-toolbelt";

interface Functor {
    readonly map: unique symbol;
}

interface Monad {
    readonly flatMap: unique symbol;
}

export var Functor: Functor;
export function t_constMap<A, B>(value: B, functor: A[]): B[];
export function t_map<A, B>(fn: (x: A) => B, functor: A[]): B[];
export const map: F.Curry<typeof t_map>;
export const constMap: F.Curry<typeof t_constMap>;
export as namespace Prelude;
