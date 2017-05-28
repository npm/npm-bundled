'use strict'

// walk the tree of deps starting from the top level list of bundled deps
// Any deps at the top level that are depended on by a bundled dep that
// does not have that dep in its own node_modules folder are considered
// bundled deps as well.  This list of names can be passed to npm-packlist
// as the "bundled" argument.  Additionally, the nodeModulesCache and
// packageJsonCache are shared so that packlist doesn't have to re-read
// dirs and files already consumed in this pass.

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
      // only collect results in node_modules folders at the top level
      // since the node_modules in a bundled dep is included always
      if (!this.parent.parent)
        this.result.add(path.basename(this.path))
      this.root = this.parent.root
      this.packageJsonCache = this.parent.packageJsonCache
      this.nodeModulesCache = this.parent.nodeModulesCache
    } else {
      this.result = new Set()
      this.root = this.path
      this.packageJsonCache = opt.packageJsonCache || new Map()
      this.nodeModulesCache = opt.nodeModulesCache || new Map()
    }

    this.children = 0
    this.node_modules = []
    this.package = null
    this.bundle = null
  }

  done () {
    if (!this.parent) {
      const res = Array.from(this.result)
      this.result = res
      this.emit('done', res)
    } else {
      this.emit('done')
    }
  }

  start () {
    const pj = this.path + '/package.json'
    if (this.packageJsonCache.has(pj))
      this.onPackage(this.packageJsonCache.get(pj))
    else
      this.readPackageJson(pj)
    return this
  }

  readPackageJson (pj) {
    fs.readFile(pj, (er, data) =>
      er ? this.emit('error', er) : this.onPackageJson(pj, data))
  }

  onPackageJson (pj, data) {
    try {
      this.package = JSON.parse(data + '')
    } catch (er) {
      return this.done()
    }
    this.packageJsonCache.set(pj, this.package)
    this.onPackage(this.package)
  }

  onPackage (pkg) {
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
    const nm = this.path + '/node_modules'
    if (this.nodeModulesCache.has(nm))
      this.onReaddir(this.nodeModulesCache.get(nm))
    else
      this.readModules()
  }

  readModules () {
    readdirNodeModules(this.path + '/node_modules', (er, nm) =>
      er ? this.done() : this.onReaddir(nm))
  }

  onReaddir (nm) {
    // keep track of what we have, in case children need it
    this.node_modules = nm

    this.nodeModulesCache.set(this.path + '/node_modules', nm)
    this.bundle.forEach(dep => this.childDep(dep))
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
    child.start()
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

  readPackageJson (pj) {
    this.onPackageJson(pj, fs.readFileSync(pj))
    return this
  }

  readModules () {
    try {
      this.onReaddir(readdirNodeModulesSync(this.path + '/node_modules'))
    } catch (er) {}
  }

  child (dep) {
    new BundleWalkerSync({
      path: this.path + '/node_modules/' + dep,
      parent: this
    }).start()
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
    new BundleWalker(options).on('done', resolve).on('error', reject).start()
  })
  return callback ? p.then(res => callback(null, res), callback) : p
}

const walkSync = options => {
  return new BundleWalkerSync(options).start().result
}

module.exports = walk
walk.sync = walkSync
walk.BundleWalker = BundleWalker
walk.BundleWalkerSync = BundleWalkerSync
