const t = require('tap')

// dep graph:
// root -> (a, b@1, c@1), BUNDLE(a)
// a -> (b@2, c@2)
// b@1 -> d@1
// c@1 -> d@1
// b@2 -> d@2
// c@2 -> d@2
//
// package tree:
// root
// +-- a (should bundle)
// |   +-- b@2 (should bundle)
// |   +-- c@2 (should bundle)
// |   +-- d@2 (should bundle)
// +-- b@1
// +-- c@1
// +-- d@1

const pkg = require('./pkgtree')(t, {
  $package: {
    name: 'root',
    version: '1.0.0',
    dependencies: {
      a: '',
      b: '1',
      c: '1',
    },
    bundleDependencies: ['a'],
  },
  a: {
    $package: {
      name: 'a',
      version: '1.0.0',
      dependencies: {
        b: '2',
        c: '2',
      },
    },
    b: { $package: {
      name: 'b',
      version: '2.0.0',
      dependencies: { d: '2.0.0' },
    } },
    c: { $package: {
      name: 'c',
      version: '2.0.0',
      dependencies: { d: '2.0.0' },
    } },
    d: { $package: { name: 'd', version: '2.0.0' } },
  },
  b: { $package: {
    name: 'b',
    version: '1.0.0',
    dependencies: { d: '1.0.0' },
  } },
  c: { $package: {
    name: 'c',
    version: '1.0.0',
    dependencies: { d: '1.0.0' },
  } },
  d: { $package: { name: 'd', version: '1.0.0' } },
})

const walk = require('../')

const check = (result, t) => {
  t.same(result, ['a'])
  t.end()
}

t.test('sync', t => check(walk.sync({ path: pkg }), t))
t.test('async', t => walk({ path: pkg }).then(res => check(res, t)))
