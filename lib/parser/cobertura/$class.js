const $Method = require('./$method')
const $Line = require('./$line')

const assert = require('assert')

/*
{
  "name": "class",
  "attributes": {
    "name": "bump-version.js",
    "filename": "bin/bump-version.js",
    "line-rate": "0",
    "branch-rate": "1"
  },
  "isSelfClosing": false
}
*/
class $Class {
  constructor ({ name, attributes }) {
    assert.ok(name === 'class')

    this._name = attributes.name
    this._filename = attributes.filename
    this._rates = {
      line: parseFloat(attributes['line-rate']),
      branch: parseFloat(attributes['branch-rate'])
    }
    this._methods = []
    this._lines = []
  }

  get name () {
    return this._name
  }

  get filename () {
    return this._filename
  }

  get methods () {
    return this._methods
  }

  get lines () {
    return this._lines
  }

  get rates () {
    return this._rates
  }

  /* internal method to keep nesting information */
  setPackageName (pkg) {
    this._pkg = pkg
  }

  addMethod (tag) {
    const method = new $Method(tag)
    this._methods.push(method)

    return method
  }

  addLine (tag) {
    this._lines.push(new $Line(tag))
  }

  toJson () {
    const lines = this._lines.map(l => l.toJson())

    return {
      name: this._name,
      pkg: this._pkg,
      filename: this._filename,
      methods: this._methods.map(m => m.toJson()),
      lines
    }
  }
}

module.exports = $Class
