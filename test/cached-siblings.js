const t = require('tap')
const { join } = require('path')
const pkgtree = require('./pkgtree')
const walk = require('../')

for (const cached of [[], ['b'], ['a'], ['a', 'b']]) {
  t.test(`cached siblings: ${cached.join(',') || 'none'}`, async t => {
    const pkg = pkgtree(t, {
      $package: { name: 'root', bundledDependencies: ['a', 'b'] },
      a: { $package: { name: 'a', version: '1.0.0' } },
      b: { $package: { name: 'b', version: '1.0.0' } },
    })
    const packageJsonCache = new Map()
    t.same(walk.sync({ path: pkg, packageJsonCache }), ['a', 'b'])

    for (const dep of ['a', 'b']) {
      if (!cached.includes(dep)) {
        packageJsonCache.delete(join(pkg, 'node_modules', dep, 'package.json'))
      }
    }

    t.same(await walk({ path: pkg, packageJsonCache }), ['a', 'b'])
  })
}

t.test('cached nested siblings finish before the root', async t => {
  const pkg = pkgtree(t, {
    $package: { name: 'root', bundledDependencies: ['a'] },
    a: {
      $package: { name: 'a', dependencies: { b: '*', c: '*' } },
      b: { $package: { name: 'b', version: '1.0.0' } },
      c: { $package: { name: 'c', dependencies: { d: '*' } } },
    },
    d: { $package: { name: 'd', version: '1.0.0' } },
  })
  const packageJsonCache = new Map()
  t.same(walk.sync({ path: pkg, packageJsonCache }), ['a', 'd'])
  t.same(await walk({ path: pkg, packageJsonCache }), ['a', 'd'])
})
