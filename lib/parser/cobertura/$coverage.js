const $Package = require('./$package')

const assert = require('assert')
/*
{
  "name": "coverage",
  "attributes": {
    "lines-valid": "700",
    "lines-covered": "240",
    "line-rate": "0.3429",
    "branches-valid": "194",
    "branches-covered": "85",
    "branch-rate": "0.43810000000000004",
    "timestamp": "1616782975307",
    "complexity": "0",
    "version": "0.1"
  },
  "isSelfClosing": false
}
*/
class Coverage {
  constructor ({ name, attributes }) {
    assert.ok(name === 'coverage')

    this._rates = {
      lineValid: parseInt(attributes['lines-valid'], 10),
      lineCovered: parseInt(attributes['lines-covered'], 10),
      lineRate: parseFloat(attributes['line-rate']),
      branchValid: attributes['branches-valid'],
      branchCovered: parseInt(attributes['branches-covered'], 10),
      branchRate: parseFloat(attributes['branch-rate']),
      timestamp: attributes.timestamp,
      complexity: parseInt(attributes.complexity, 10),
      version: attributes.version
    }
    this.sources = []
    this.packages = []
    this.classes = []
  }

  get rates () {
    return this._rates
  }

  addSource (tag) {
    // console.log('addSource', tag)
    // throw new Error('source')
    // this._sources.push()
  }

  addPackage (tag) {
    this._$package = new $Package(tag)

    this.packages.push(this._$package)

    return this._$package
  }

  addClass (tag) {
    if (!this._$package) {
      throw new Error('Need a package to add a class')
    }

    this._$class = this._$package.addClass(tag)
    this._$class.setPackageName(this._$package.name)

    this.classes.push(this._$class)

    return this._$class
  }

  addMethod (tag) {
    if (!this._$class) {
      throw new Error('Need a class to add a method')
    }

    this._$method = this._$class.addMethod(tag)

    return this._$method
  }

  addLine (tag) {
    // add line either to method or to class
    const parent = this._$method || this._$class

    if (!parent) {
      throw new Error('Missing context to add a line')
    }

    return parent.addLine(tag)
  }

  closePackage () {
    this._$package = null
  }

  closeClass () {
    this._$class = null
  }

  closeMethod () {
    this._$method = null
  }

  toJson () {
    return {
      sources: this._sources,
      classes: this.classes.map(c => c.toJson())
    }
  }
}

Coverage.map = {
  coverage: Coverage,
  package: Coverage.addPackage,
  class: Coverage.addClass,
  method: Coverage.addMethod,
  line: Coverage.addLine
}

module.exports = Coverage
