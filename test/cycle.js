const t = require('tap')

const pkg = require('./pkgtree')(t, {
  $package: {
    name: 'a',
    version: '1.2.3',
    dependencies: {
      b: '1.2.3',
    },
    bundledDependencies: ['b'],
  },
  b: { $package: {
    name: 'b',
    version: '1.2.3',
    dependencies: {
      c: '1.2.3',
    },
  } },
  c: { $package: {
    name: 'c',
    version: '1.2.3',
    dependencies: {
      b: '1.2.3',
    },
  } },
})

const walk = require('../')

const check = (result, t) => {
  t.same(result, ['b', 'c'])
  t.end()
}

t.test('sync', t => check(walk.sync({ path: pkg }), t))
t.test('async', t => walk({ path: pkg }).then(res => check(res, t)))
