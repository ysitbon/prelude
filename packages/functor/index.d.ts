import {F, L} from "ts-toolbelt";

export const map: F.Curry<(<A, B>(fn: (x: A) => B, scope: Array<A>) => Array<B>)>;
export const constMap: F.Curry<(<A, B>(value: B, scope: Array<A>) => Array<B>)>;