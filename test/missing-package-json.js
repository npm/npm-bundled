'use strict'
const t = require('tap')
const path = require('path')
const pkg = path.resolve(__dirname, path.basename(__filename, '.js'))

require('./pkgtree.js')(pkg, {
  $package: {
    name: 'a',
    version: '1.2.3',
    dependencies: {
      b: '1.2.3',
      d: '1.2.3'
    },
    bundledDependencies: [ 'b' ]
  },
  b: {
    d: { $package: {
      name: 'd',
      version: '1.2.3',
      dependencies: {
        e: '1.2.3'
      }
    }},
    $package: {
      name: 'b',
      version: '1.2.3',
      dependencies: {
        c: '1.2.3',
        d: '1.2.3'
      }
    }
  },
  c: { $package: {
    name: 'c',
    version: '1.2.3'
  }},
  d: { $package: {
    name: 'd',
    version: '1.2.3',
    dependencies: {
      c: '1.2.3'
    }
  }},
  e: {}
}, t)

const walk = require('../')

const check = (result, t) => {
  t.same(result, ['b', 'c', 'e'])
  t.end()
}

t.test('sync', t => check(walk.sync({path: pkg}), t))
t.test('async', t => walk({path: pkg}).then(res => check(res, t)))
