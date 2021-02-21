/*eslint-env node*/
const fs     = require("fs");
const path   = require("path");
const {exec} = require("child_process");

/**
 * Runs a command on a specified working directory.
 *
 * @param {string} program
 * The program to execute.
 *
 * @param {string} [cwd]
 * Path of the working directory.
 *
 * @returns {Promise<Buffer>}
 * Returns the output of the program.
 */
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

/**
 * List all valid package contained inside the `packages` folder. A valid
 * package is a directory contains an `src` directory and a `package.json`
 * file.
 *
 * @returns {Promise<string[]>}
 * Returns the list of packages directories.
 */
exports.listPackages = async () => {
  const dir = await fs.promises.opendir(exports.packagesRoot);
  const out = [];
  for await (const entry of dir) {
    if (!entry.isDirectory()) continue;
    if (!fs.existsSync(`${exports.package(entry.name)}/src`)) continue;
    out.push(entry.name);
  }
  return out;
};

/**
 * Builds a `build` command for a specified package.
 *
 * @param name
 * The name of the package to watch.
 *
 * @returns {string}
 * Returns the built command.
 */
exports.build = name => {
  const packagePath = exports.package(name);
  return `npx babel ${packagePath}/src --out-dir ${packagePath}/lib`;
};

/**
 * Builds a `watch` command for a specified package.
 *
 * @param name
 * The name of the package to watch.
 *
 * @returns {string}
 * Returns the built command.
 */
exports.watch = name => `${exports.build(name)} --watch`;

/**
 * Gets absolute path for a specified package name.
 *
 * @param {string} name
 * The package name.
 *
 * @returns {string}
 * Returns the absolute path of the package.
 */
exports.package = name => `${exports.packagesRoot}/${name}`;

/// Specifies the packages root path.
exports.packagesRoot = path.resolve(process.cwd(), "./packages");
