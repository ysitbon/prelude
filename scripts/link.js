/*eslint-env node*/
const {run} = require('./run.js');

run("npm unlink @prelude/babel")
  .then(_ => run("npm unlink", "./packages/babel"))
  .then(_ => run("npm link", "./packages/babel"))
  .then(_ => run("npm link @prelude/babel"))
  .catch(console.error);
