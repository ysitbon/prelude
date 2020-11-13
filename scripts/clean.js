/*eslint-env node*/
const fs   = require("fs");
const util = require("./util.js");
const clean = ["coverage", "lib", "node_modules"];
util
  .packages()
  .then(xs => Promise.all(xs.map(name =>
    Promise.all(clean.map(dir => fs.existsSync(`${util.package(name)}/${dir}`)
      ? fs.promises.rmdir(`${util.package(name)}/${dir}`, {recursive: true})
      : Promise.resolve()
    ))
  )))
  .catch(console.error);
