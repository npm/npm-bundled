const t = require('tap')
const fs = require('fs')

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

const check = (result, t) => t.same(result, ['b', 'c', 'e'])
const checkEmpty = (result, t) => t.same(result, [])

t.test('sync', t => {
  t.plan(2)
  const bw = new walk.BundleWalkerSync({ path: pkg })
  const bw2 = new walk.BundleWalkerSync({
    path: pkg,
    packageJsonCache: bw.packageJsonCache,
  })
  bw.start()
  bw2.start()
  check(bw.result, t)
  check(bw2.result, t)
})

t.test('async', t => {
  t.plan(2)
  process.chdir(pkg)
  const bw = new walk.BundleWalker()
  const bw2 = new walk.BundleWalker({
    packageJsonCache: bw.packageJsonCache,
  })
  bw.on('done', result => check(result, t))
  bw2.on('done', result => check(result, t))
  bw.start()
  bw2.start()
})

t.test('mixed', t => {
  t.plan(2)
  process.chdir(pkg)
  const bw = new walk.BundleWalkerSync({ path: pkg })
  const bw2 = new walk.BundleWalker({
    packageJsonCache: bw.packageJsonCache,
  })
  bw.start()
  check(bw.result, t)
  bw2.start()
  bw2.on('done', result => check(result, t))
})

t.test('mixed, nothing to bundle', t => {
  fs.writeFileSync(pkg + '/package.json', JSON.stringify({
    name: 'a',
    version: '1.2.3',
    dependencies: {
      b: '1.2.3',
      d: '1.2.3',
    },
  }, null, 2))

  t.plan(2)
  process.chdir(pkg)
  const bw = new walk.BundleWalkerSync({ path: pkg })
  const bw2 = new walk.BundleWalker({
    packageJsonCache: bw.packageJsonCache,
  })
  bw.start()
  checkEmpty(bw.result, t)
  bw2.start()
  bw2.addListener('done', result => checkEmpty(result, t))
})
