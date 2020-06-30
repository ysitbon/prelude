# WORK IN PROGRESS (DO NOT USE)

Personal functional programming tools for JavaScript. This intentionally does 
not follow FantasyLand spec. This is mainly used as a learning tool about basic 
concepts of FP around JavaScript. So, to be understandable, as much as possible,
the code favored readability over performance. 

### Install

```
npm install
```

This is a mono-repository project managed with [lerna](https://lerna.js.org/).
The `lerna bootstrap` command automatically runs during `npm install`.

### Unit test

Unit-tests and code-coverages are done with `mocha`, `chai`, `nyc` and custom
`babel` register and `test-spies` contained in `packages` folder. To unit-tests
for all packages at the same time:
 
```
npm run test
```

### About class avoidance

In this project, usage of `class` is avoided since contructors for algebraic data 
types should be able to return values without using `new` keyword and also partially 
applied. For example the `Maybe` functor could've been implemented like this:

```js
class Maybe {
  static of(value) {
    return null == value
      ? new Just()
      : new Nothing()
  }
  constructor(value) {
    if (Maybe === new.target) 
      throw new Error("Data type contructor cannot be instantiated");
    this.value = value;
  }
  isJust() {
    return this instanceof Just;
  }
  [Functor.map](fn) {
    return this.isJust()
      ? Maybe.of(fn(this.value))
      : this
  }
}

class Just {
  constructor(value) {
    if (null == value) 
      throw new Error("Just does not allow nullable types");
    super(value);
  }
}

class Nothing() {
  constructor() {
    super(null);
  }
}
```

But this form is preferred.

```js
function Maybe(value) {
  if (Maybe === new.target) 
    throw new Error("Data type contructor cannot be instantiated");
  this.value = value;
}

extension(Maybe.prototype, {
  isJust() {
    return this instanceof Just;
  },
  [Functor.map](fn) {
    return this.isJust()
      ? Maybe.of(fn(this.value))
      : this
  }
})

function Just(value) {
  if (!(this instanceof Just))
    return new Just(value);
  if (null == value) 
    throw new Error("Just does not allow nullable types");
  Maybe.call(this, value); 
}

Just.prototype = Object.create(Maybe.prototype);

let NothingSingleton;

function Nothing() {
  if (!(this instanceof Nothing))
    return NothingSingleton || (NothingSingleton = new Nohting());
  Maybe.call(this, null);
}

Nothing.prototype = Object.create(Maybe.prototype);
```

The usage of `class` make you loose lots of Javascript power. JS constructors 
implemented with the good old first-class `function` has always been more powerfull. 
The construction time can be optimized, memoizied, curried etc. It is also less 
verbose and can be used as simple callback `[1, 2, 3].map(Just)`.
