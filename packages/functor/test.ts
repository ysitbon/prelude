import {Functor, map} from "./index";

const ys = [1, 2, 3]
    [Functor.map](x => x + 1);

const ws = map(x => x + 1, [1, 2, 3]);