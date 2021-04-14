const assert = require('assert')

/*
{
  "name": "method",
  "attributes": {
    "number":"41",
    "hits":"0",
    "branch": "false"
  },
  "isSelfClosing": false
}
{
  "name": "method",
  "attributes": {
    "number":"41",
    "hits":"0",
    "branch": "true",
    "condition-coverage": "50% (1/2)"
  },
  "isSelfClosing": false
}
*/

class $Line {
  constructor ({ name, attributes }) {
    assert.ok(name === 'line')

    const { number, hits, branch = 'false' } = attributes

    this._number = parseInt(number, 10)
    this._hits = parseInt(hits, 10)

    this._branch = branch
    this._branchCoverage = branch === 'true' ? this._parseBranchCoverage(attributes['condition-coverage']) : false
  }

  get number () {
    return this._number
  }

  get hits () {
    return this._hits
  }

  get branch () {
    return this._branch
  }

  get branchCoverage () {
    return this._branchCoverage
  }

  /* 100% (2/2) or 50% (1/2) */
  _parseBranchCoverage (coverageInfos = null) {
    if (!coverageInfos) {
      return null
    }

    const $match = coverageInfos.match($Line.coverageInfosPattern)

    if (!$match) {
      return null
    }

    return {
      covered: parseInt($match[2], 10),
      total: parseInt($match[3], 10)
    }
  }

  toJson () {
    return {
      number: this._number,
      hits: this._hits,
      branch: this._branch ? this._branchCoverage : false
    }
  }
}

$Line.coverageInfosPattern = /(\d+)% \((\d+)\/(\d+)\)/

module.exports = $Line
