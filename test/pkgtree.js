'use strict'
// create a package tree for a test
// pass in the test object to rm on teardown

const mkdirp = require('mkdirp')
const fs = require('fs')
const rimraf = require('rimraf')

const pkgtree = module.exports = (dir, tree, t) => {
  if (t)
    t.teardown(_ => rimraf.sync(dir))

  mkdirp.sync(dir)
  Object.keys(tree).forEach(dep => {
    if (dep === '$package') {
      const pkg = tree[dep]
      const output = pkg.invalid ? '💩' : (JSON.stringify(pkg, null, 2) + '\n')
      fs.writeFileSync(dir + '/package.json', output)
    } else
      pkgtree(dir + '/node_modules/' + dep, tree[dep])
  })
}

if (require.main === module)
  require('tap').pass('this is fine')
