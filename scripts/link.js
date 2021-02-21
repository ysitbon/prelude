/*eslint-env node*/
const {run} = require('./_util.js');

// Link workspace packages (clean any link to them before).
run("npm unlink @prelude/babel")
  .then(_ => run("npm link", "./packages/babel"))
  .then(_ => run("npm link @prelude/babel"))
  .catch(console.error);
