declare module "@prelude/data-trait" {
    export const deriving: unique symbol;
    export type Trait<T> = Readonly<T & {[deriving]: Readonly<Trait<any>>}>;
    export type Constructor<T> = new <U>(...args: [...U]) => T;
    export function trait<T>(descriptor: T): Trait<T>;
    export function impl<T, TDescriptor, TPrototype>(trait: Trait<T>, descriptor: TDescriptor): (constructor: Constructor<TPrototype>) => Constructor<TPrototype & TDescriptor>;
}
