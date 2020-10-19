Functional programming tools for JavaScript. This intentionally does not follow 
FantasyLand spec. Used as a learning tool about basic concepts of FP around 
JavaScript. Favor readability over performance. 

### Install

```
npm install
```

This is a mono-repository project managed with [lerna](https://lerna.js.org/).
The `lerna bootstrap` command automatically runs during `npm install`.

### Unit test

Unit-tests and code-coverages are done with `mocha`, `chai`, `c8` and custom 
`test-spies` impl contained in `packages` folder. To unit-tests all packages 
at the same time:
 
```
npm run test
```
