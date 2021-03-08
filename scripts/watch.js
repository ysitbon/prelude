/*eslint-env node*/
const util = require("./_util.js");

// Execute `watch` command on all packages.
util
  .lsPkg()
  .then(xs => Promise.all(xs.map(name => util.run(util.watch(name)))))
  .catch(console.error);
