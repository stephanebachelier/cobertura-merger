const $Class = require('./$class')

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
class $Package {
  constructor ({ name, attributes }) {
    assert.ok(name === 'package')

    this._name = attributes.name
    this._rates = {
      line: parseFloat(attributes['line-rate']),
      branch: parseFloat(attributes['branch-rate'])
    }
    this.classes = []
  }

  set name (value) {
    if (value && value.length > 0) {
      this._name = value
    }
  }

  get name () {
    return this._name
  }

  get rates () {
    return this._rates
  }

  addClass (tag) {
    this._$class = new $Class(tag)
    this.classes.push(this._$class)

    return this._$class
  }

  toJson () {
    return {
      name: this.name,
      rates: this.rates,
      classes: this.classes.map(c => c.toJson())
    }
  }
}

module.exports = $Package
