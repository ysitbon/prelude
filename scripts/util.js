/*eslint-env node*/
const fs        = require("fs");
const path      = require("path");
const {exec}    = require('child_process');

exports.run = (program, cwd) => new Promise((ok, err) => {
  console.log("run:start", program);
  exec(
    program,
    {
      cwd: !cwd
        ? process.cwd()
        : path.resolve(process.cwd(), cwd)
    },
    (e, stdout) => {
      console.log("run:stop", program);
      e === null
        ? ok(stdout)
        : err(e);
    }
  );
});

exports.packages = async () => {
  const dir = await fs.promises.opendir(exports.pkgs);
  const out = [];
  for await (const entry of dir) {
    if (entry.isDirectory() &&
        fs.existsSync(`${exports.package(entry.name)}/src`)) {
      out.push(entry.name);
    }
  }
  return out;
};

exports.package = name => `${exports.pkgs}/${name}`;

exports.build = name =>
  `npx babel ${exports.pkgs}/${name}/src --out-dir ${exports.pkgs}/${name}/lib`;

exports.watch = name => `${exports.build(name)} --watch`;

exports.pkgs = path.resolve(process.cwd(), "./packages");
