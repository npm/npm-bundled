'use strict'
const t = require('tap')
const path = require('path')
const pkg = path.resolve(__dirname, './fixtures/bundle-ms-rest-azure')

const walk = require('../')

const check = (result, t) => {
  t.end()
}

t.test('sync', t => check(walk.sync({path: pkg}), t))
t.test('async', t => walk({path: pkg}).then(res => check(res, t)))
