'use strict'

// Once a dep is bundled, all its children are bundled
// build the tree of who loads what
// for each bundle dep at the top level only, walk their deps
// and mark all of the ones in those trees as bundled
// each dep loaded by a bundled dep is bundled, and metadeps

const fs = require('fs')
const path = require('path')
const EE = require('events').EventEmitter

class BundleWalker extends EE {
  constructor (opt) {
    opt = opt || {}
    super(opt)
    this.path = path.resolve(opt.path || process.cwd())

    this.parent = opt.parent || null
    if (this.parent) {
      this.result = this.parent.result
      this.result.add(this.path)
      this.root = this.parent.root
    } else {
      this.result = new Set()
      this.root = this.path
    }

    this.children = 0
    this.node_modules = []
    this.package = null
    this.bundle = null
  }

  done () {
    if (!this.parent) {
      const res = Array.from(this.result).map(
        f => f.substr(this.root.length + 1)
      )
      this.result = res
      this.emit('done', res)
    } else {
      this.emit('done')
    }
  }

  walk () {
    fs.readFile(this.path + '/package.json', (er, data) =>
      er ? this.emit('error', er) : this.onPackageJson(data))
  }

  onPackageJson (data) {
    try {
      this.package = JSON.parse(data + '')
    } catch (er) {
      return this.done()
    }

    const pkg = this.package

    // all deps are bundled if we got here as a child.
    // otherwise, only bundle bundledDeps
    // Get a unique-ified array with a short-lived Set
    const bd = Array.from(new Set(
      this.parent ? Object.keys(pkg.dependencies || {}).concat(
        Object.keys(pkg.optionalDependencies || {}))
      : pkg.bundleDependencies || pkg.bundledDependencies || []
    ))

    if (!bd.length) {
      return this.done()
    }

    this.bundle = bd
    this.readModules()
  }

  readModules () {
    readdirNodeModules(this.path + '/node_modules', (er, nm) =>
      er ? this.done() : this.onReaddir(nm))
  }

  onReaddir (nm) {
    // keep track of what we have, in case children need it
    this.node_modules = nm
    this.bundle.forEach(dep => {
      this.childDep(dep)
    })
    if (this.children === 0)
      this.done()
  }

  childDep (dep) {
    if (this.node_modules.indexOf(dep) !== -1) {
      this.child(dep)
    } else if (this.parent)
      this.parent.childDep(dep)
  }

  child (dep) {
    const p = this.path + '/node_modules/' + dep
    this.children += 1
    const child = new BundleWalker({
      path: p,
      parent: this
    })
    child.walk()
    child.on('done', _ => {
      if (--this.children === 0)
        this.done()
    })
  }
}

class BundleWalkerSync extends BundleWalker {
  constructor (opt) {
    super(opt)
  }

  walk () {
    try {
      this.onPackageJson(fs.readFileSync(
        this.path + '/package.json'))
    } catch (er) {}
    return this
  }

  readModules () {
    //try {
      const nm = readdirNodeModulesSync(this.path + '/node_modules')
      this.onReaddir(nm)
    //} catch (er) {}
  }

  child (dep) {
    new BundleWalkerSync({
      path: this.path + '/node_modules/' + dep,
      parent: this
    }).walk()
  }
}

const readdirNodeModules = (nm, cb) => {
  fs.readdir(nm, (er, set) => {
    if (er)
      cb(er)
    else {
      const scopes = set.filter(f => /^@/.test(f))
      if (!scopes.length)
        cb(null, set)
      else {
        let count = scopes.length
        scopes.forEach(scope => {
          fs.readdir(nm + '/' + scope, (er, pkgs) => {
            if (er)
              cb(er)
            else {
              if (er || !pkgs.length)
                set.push(scope)
              else
                set.push.apply(set, pkgs.map(p => scope + '/' + p))
              if (--count === 0)
                cb(null, set)
            }
          })
        })
      }
    }
  })
}

const readdirNodeModulesSync = nm => {
  const set = fs.readdirSync(nm)
  const scopes = set.filter(f => /^@/.test(f))
  scopes.forEach(scope => {
    const pkgs = fs.readdirSync(nm + '/' + scope)
    if (!pkgs.length)
      set.push(scope)
    else
      set.push.apply(set, pkgs.map(p => scope + '/' + p))
  })
  return set
}

const walk = (options, callback) => {
  const p = new Promise((resolve, reject) => {
    new BundleWalker(options).on('done', resolve).on('error', reject).walk()
  })
  return callback ? p.then(res => callback(null, res), callback) : p
}

const walkSync = options => {
  return Array.from(new BundleWalkerSync(options).walk().result)
}

module.exports = walk
walk.sync = walkSync
walk.BundleWalker = BundleWalker
walk.BundleWalkerSync = BundleWalkerSync
