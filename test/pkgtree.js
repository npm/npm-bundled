'use strict'
// create a package tree for a test
// pass in the test object to rm on teardown

const generateTestdir = (tree) => {
  return Object.entries(tree).reduce((acc, [dep, pkg]) => {
    if (dep === '$package') {
      acc['package.json'] = pkg.invalid
        ? '💩'
        : (JSON.stringify(pkg, null, 2) + '\n')
    } else {
      acc.node_modules[dep] = generateTestdir(pkg)
    }
    return acc
  }, { node_modules: {} })
}

module.exports = (t, tree) => t.testdir(generateTestdir(tree))

if (require.main === module) {
  require('tap').pass('this is fine')
}
