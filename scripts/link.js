/*eslint-env node*/
const {exec}    = require('child_process');
const {resolve} = require('path');
const cwd = process.cwd();

exec("npm unlink @prelude/babel", {cwd});
exec("npm link", {cwd: resolve(cwd, "./packages/babel")});
exec("npm link @prelude/babel", {cwd});
