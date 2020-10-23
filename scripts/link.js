/*eslint-env node*/
const {exec}    = require('child_process');
const {resolve} = require('path');
const cwd = process.cwd();
const pbd = resolve(cwd, "./packages/babel");

exec("npm link", {cwd: pbd});
exec("npm link @prelude/babel", {cwd});
