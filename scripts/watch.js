/*eslint-env node*/
const util = require("./util.js");

util
  .packages()
  .then(xs => Promise.all(xs.map(name => util.run(util.watch(name)))))
  .catch(console.error);
