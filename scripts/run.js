/*eslint-env node*/
const {exec}    = require('child_process');
const {resolve} = require('path');

exports.run = (program, cwd) => new Promise((ok, err) => exec(
  program,
  {
    cwd: !cwd
      ? process.cwd()
      : resolve(process.cwd(), cwd)
  },
  (e, stdout) => e === null
    ? ok(stdout)
    : err(e)
));
