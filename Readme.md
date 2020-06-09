# WORK IN PROGRESS (DO NOT USE)

Personal functional programming tools for JavaScript. This intentionally does 
not follow FantasyLand spec. This is mainly used as a learning tool about basic 
concepts of FP around JavaScript. So, to be understandable, as much as possible,
the code favored readability over performance. 

### Install

```
npm install
```

This is a mono-repository project managed with [lerna](https://lerna.js.org/).
The `lerna bootstrap` command automatically runs during `npm install`.

### Unit test

Unit-tests and code-coverages are done with `mocha`, `chai`, `nyc` and custom
`babel` register and `test-spies` contained in `packages` folder. To unit-tests
for all packages at the same time:
 
```
npm run test
```
