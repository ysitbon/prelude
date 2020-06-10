/// <reference path="./index.d.ts"/>
import Functor = Prelude.Functor;

/** @impl Array<T> for Functor */
interface Array<T> {
    /**
     * Map values of the array to others with the specified function.
     *
     * @example
     * [1, 2, 3][Functor.map](x => x + 1);
     * // -> [2, 3, 4]
     *
     * @param fn
     * The function to call for each item of the array.
     *
     * @return
     * Returns a new array containing the mapped values.
     */
    [Functor.map]<R>(fn: (x: T) => R): R[];
}
