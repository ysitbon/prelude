/*eslint-env node*/
const fs   = require("fs");
const util = require("./_util.js");
const clean = ["coverage", "lib", "node_modules"];

// Execute `clean` command on all packages.
util
  .lsPkg()
  .then(xs => Promise.all(xs.map(name =>
    Promise.all(clean.map(dir => fs.existsSync(`${util.pkgPath(name)}/${dir}`)
      ? fs.promises.rmdir(`${util.pkgPath(name)}/${dir}`, {recursive: true})
      : Promise.resolve()
    ))
  )))
  .catch(console.error);
