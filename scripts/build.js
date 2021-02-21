/*eslint-env node*/
const util = require("./_util.js");

// Execute `build` command on all packages.
util
  .listPackages()
  .then(xs => Promise.all(xs.map(name => util.run(util.build(name)))))
  .catch(console.error);
