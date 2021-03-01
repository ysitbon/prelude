/*eslint-env node,mocha*/
import {map}         from "@prelude/trait-functor";
import {apply, pure} from "@prelude/trait-applicative";
import {flatMap}     from "@prelude/trait-monad";
import {Identity}    from "@prelude/data-identity";
import {Maybe, Just} from "@prelude/data-maybe";
import {runWriterT}  from "../lib/index.js";
import assert        from "assert";

describe("@prelude/data-transformer-writer", () => {

});
