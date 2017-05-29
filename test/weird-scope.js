'use strict'
const t = require('tap')
const path = require('path')
const pkg = path.resolve(__dirname, path.basename(__filename, '.js'))

require('./pkgtree.js')(pkg, {
  $package: {
    name: '@a/a',
    version: '1.2.3',
    dependencies: {
      '@x/b': '1.2.3',
      '@y/d': '1.2.3',
      '@weird/asdf': '1.2.3',
      '@missing/scope': '1.2.3'
    },
    bundleDependencies: [ '@x/b', '@weird/asdf', '@missing/scope' ]
  },
  '@x/b': {
    '@y/d': { $package: {
      name: '@y/d',
      version: '1.2.3',
      dependencies: {
        e: '1.2.3'
      }
    }},
    $package: {
      name: '@x/b',
      version: '1.2.3',
      dependencies: {
        '@q/c': '1.2.3',
        '@y/d': '1.2.3'
      }
    }
  },
  '@q/c': { $package: {
    name: '@q/c',
    version: '1.2.3'
  }},
  '@y/d': { $package: {
    name: '@y/d',
    version: '1.2.3',
    dependencies: {
      '@q/c': '1.2.3'
    }
  }},
  e: { $package: {
    name: 'e',
    version: '1.2.3'
  }}
}, t)

// put a weird not-package thing in a node_modules @-scope "folder"
const fs = require('fs')
fs.writeFileSync(pkg + '/node_modules/@weird', 'not a dir')
fs.mkdirSync(pkg + '/node_modules/@missing')

const walk = require('../')

const check = (result, t) => {
  t.same(result, ['@x/b', '@q/c', 'e'])
  t.end()
}

t.test('sync', t => check(walk.sync({path: pkg}), t))
t.test('async', t => walk({path: pkg}).then(res => check(res, t)))
