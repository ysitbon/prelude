/* eslint-disable no-inner-declarations*/
import {pipe}                     from "@prelude/data-function";
import {impl}                     from "@prelude/data-trait";
import {Functor, map}             from "@prelude/trait-functor";
import {Applicative, pure, liftA} from "@prelude/trait-applicative";
import {Monad, flatMap}           from "@prelude/trait-monad";
import {empty}                    from "@prelude/trait-monoid";
import {append}                   from "@prelude/trait-semigroup";

/**
 * @template {Monad} KMonad
 * @template TResult, TOutput
 * @param {WriterT<TOutput, KMonad, TResult>} writerT
 * The writer transformer reference to consume.
 *
 * @returns {KMonad<[TResult, TOutput]>}
 * Returns a monad combining the result and the sum of all outputs.
 */
export const runWriterT = writerT => writerT.value;

/**
 * Gets a writer transformer for a specific kind of monad.
 *
 * @template {Monad} KMonad
 * @template TResult, TOutput
 * @param {KMonad} MonadConstructor
 * Reference to the monad constructor.
 *
 * @returns {WriterTImpl}
 */
export const getWriterT = MonadConstructor => {
  const writer = writers.get(MonadConstructor);
  if (undefined === writer) {
    const newWriter = makeWriterT(MonadConstructor);
    writers.set(MonadConstructor, newWriter);
    return newWriter;
  }
  return writer;
};

/**
 * Builds a writer transformer implementation for a specific kind of monad.
 *
 * @return {WriterTImpl}
 * Returns the implemented transformer interface.
 */
const makeWriterT = MonadConstructor => {
  // TODO: consider lazy writer instead?
  /**
   * Constructs a new WriterT reference.
   *
   * @template {Monad} KMonad
   * @template {Monoid} TStream
   * @template TResult
   * @param {KMonad<[TResult, TStream]>} writer
   * The internal writer monad.
   */
  function WriterT(writer) {
    if (new.target === undefined) {
      return new WriterT(writer);
    }
    else {
      this.value = writer;
    }
  }

  WriterT |> impl(Functor, {
    [Functor.map](fn) {
      return WriterT(runWriterT(this) |> map(fn));
    }
  });

  WriterT |> impl(Applicative, {
    [Applicative.pure](initialResult, MonoidConstructor) {
      return WriterT([initialResult, MonoidConstructor |> empty]
        |> pure(MonadConstructor)
      );
    },
    [Applicative.apply](writerArg) {
      return WriterT([runWriterT(this), runWriterT(writerArg)]
        |> liftA(([fn, outputA], [arg, outputB]) => [
          fn(arg),
          outputA |> append(outputB)
        ])
      );
    }
  });

  WriterT |> impl(Monad, {
    [Monad.flatMap](fn) {
      return WriterT(runWriterT(this)
        |> flatMap(([resultA, outputA]) => runWriterT(fn(resultA))
          |> map(([resultB, outputB]) => [
            resultB,
            outputA |> append(outputB)
          ])
        )
      );
    }
  });

  /**
   * Extract the output from a writer computation.
   *
   * @template {Monad} KMonad
   * @template {Monoid} TStream
   * @template TResult
   * @param {WriterT<TStream, KMonad, TResult>} writerT
   * The writer from which to extract computation output.
   *
   * @return {KMonad<TStream>}
   * Returns the extracted writer computation.
   */
  const execWriterT = writerT =>
    runWriterT(writerT) |> map(([_, output]) => output);

  /**
   * Maps a writer monad into a new kind of writer monad.
   *
   * @template {Monad} KMonadIn
   * @template {Monoid} KStreamIn
   * @template TResultIn
   * @template {Monad} KMonadOut
   * @template {Monoid} KStreamOut
   * @template TResultOut
   * @param {KMonadOut} NewMonadConstructor
   * The monad constructor to map into.
   *
   * @param {function(KMonadIn<[TResultIn, KStreamIn]>)
   *   : KMonadOut<[TResultOut, KStreamOut]>} fn
   * The function which maps over 2 monads kind.
   *
   * @return {function(WriterT<KStreamIn, KMonadIn, TResultIn>)
   *   : WriterT<KStreamOut, KMonadOut, TResultOut>}
   * Returns the new created writer monad.
   */
  const mapWriterT = (NewMonadConstructor, fn) => writerT => {
    const {WriterT} = getWriterT(NewMonadConstructor);
    return WriterT(runWriterT(writerT) |> pipe(fn));
  };

  /**
   * Construct a writer computation from a `[result, output]` pair.
   *
   * @template {Monad} KMonad
   * @template {Monoid} KStream
   * @template TResult
   * @param {[TResult, KStream]} context
   * The writer output to set.
   *
   * @return {WriterT<KStream, KMonad, TResult>}
   * Returns created writer monad.
   */
  const writer = WriterT |> pipe(pure(MonadConstructor));

  /**
   * Produces a writer from a stream.
   *
   * @template {Monad} KMonad
   * @template {Monoid} KStream
   * @template TResult
   * @param {KStream} output
   * The writer output to set.
   *
   * @return {WriterT<KStream, KMonad, TResult>}
   * Returns created writer monad.
   */
  const tell = output => writer([{}, output]);

  /**
   * Executes the action and adds its output stream to the result of the
   * computation.
   *
   * @template {Monad} KMonad
   * @template {Monoid} KStream
   * @template TResult
   * @return {WriterT<KStream, KMonad, [TResult, KStream]>}
   * Returns a new writer monad.
   */
  const listen = writerT => runWriterT(writerT)
    |> map(([result, stream]) => [[result, stream], stream]);

  /**
   * Executes `writerT` action, and adds the result of applying `fn` to the
   * output stream to the value of the computation.
   *
   * @template {Monad} KMonad
   * @template {Monoid} KStream
   * @template TResultA
   * @template TResultB
   * @param {function(KStream): TResultB} fn
   * @return {function(WriterT<KStream, KMonad, [TResultA, KStream]>)
   *   : WriterT<KStream, KMonad, [TResultA, TResultB]>}
   * Returns a new writer monad.
   */
  const listens = fn => writerT => runWriterT(writerT)
    |> map(([result, stream]) => [[result, fn(stream)], stream]);

  /**
   * Executes `writerT` action, which returns a value and a function, and
   * returns the value, applying the function to the output stream.
   *
   * @template {Monad} KMonad
   * @template {Monoid} KStream
   * @template TResult
   * @return {WriterT<KStream, KMonad, [TResult, KStream]>}
   * Returns a new writer monad.
   */
  const pass = writerT => runWriterT(writerT)
    |> map(([[result, fn], stream]) => [result, fn(stream)]);

  /**
   * Executes `writerT` action, and applies the function `fn` to its output
   * stream, leaving the return value unchanged.
   *
   * @template {Monad} KMonad
   * @template {Monoid} KStream
   * @template TResult
   * @param {function(KStream): KStream} fn
   * @return {function(WriterT<KStream, KMonad, KStream>)
   *   : WriterT<KStream, KMonad, KStream>}
   * Returns a new writer monad.
   */
  const censor = fn => writerT => runWriterT(writerT)
    |> map(([result, stream]) => [result, fn(stream)]);

  /** @typedef WriterTImpl **/
  return {
    WriterT,
    execWriterT,
    mapWriterT,
    writer,
    tell,
    listen,
    listens,
    pass,
    censor
  };
};

/**
 * @template {Monad} KMonad
 * @type {WeakMap<Constructor<KMonad>, ImplWriterT<KMonad>}
 */
const writers = new WeakMap();
