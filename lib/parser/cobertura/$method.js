const $Line = require('./$line')

const assert = require('assert')
/*
{
  "name": "method",
  "attributes": {
    "name":"(anonymous_0)",
    "hits":"0",
    "signature":"()V"
  },
  "isSelfClosing": false
}
*/

class $Method {
  constructor ({ name, attributes }) {
    assert.ok(name === 'method')

    this._name = attributes.name
    this._hits = attributes.hits
    this._signature = attributes.signature

    this._lines = []
  }

  get name () {
    return this._name
  }

  get hits () {
    return this._hits
  }

  get signature () {
    return this._signature
  }

  get lines () {
    return this._lines
  }

  addLine (tag) {
    this._lines.push(new $Line(tag))
  }

  toJson () {
    return {
      name: this.name,
      hits: this.hits,
      signature: this.signature,
      lines: this._lines.map(l => l.toJson())
    }
  }
}

module.exports = $Method
