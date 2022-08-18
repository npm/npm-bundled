const t = require('tap')
const mutateFS = require('mutate-fs')

const pkg = require('./pkgtree')(t, {
  $package: {
    name: 'a',
    version: '1.2.3',
    dependencies: {
      b: '1.2.3',
      d: '1.2.3',
    },
    bundledDependencies: ['b'],
  },
  b: {
    d: { $package: {
      name: 'd',
      version: '1.2.3',
      dependencies: {
        e: '1.2.3',
      },
    } },
    $package: {
      name: 'b',
      version: '1.2.3',
      dependencies: {
        c: '1.2.3',
        d: '1.2.3',
      },
    },
  },
  c: { $package: {
    name: 'c',
    version: '1.2.3',
  } },
  d: { $package: {
    name: 'd',
    version: '1.2.3',
    dependencies: {
      c: '1.2.3',
    },
  } },
  e: { $package: {
    name: 'e',
    version: '1.2.3',
  } },
})

const walk = require('../')

const check = (result, t) => {
  t.same(result, [])
  t.end()
}

t.test('fail the readdir', t => {
  const poop = new Error('poop')
  t.teardown(mutateFS.fail('readdir', poop))

  t.test('sync', t => check(walk.sync({ path: pkg }), t))
  t.test('async', t => walk({ path: pkg }).then(res => check(res, t)))
  t.end()
})
