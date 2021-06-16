const isEmpty = require('lodash/isEmpty')
const pick = require('lodash/pick')
const findIndex = require('lodash/findIndex')
const log = require('debug')('report')
const logMerge = require('debug')('report:merge')
const $$Coverage = require('./coverage')

class CoverageReport {
  constructor() {
    this.coverage = null
  }

  parse(tree) {
    log('parse coverage %o', tree.coverage)
    if (!isEmpty(this.coverage)) {
      throw new Error('`parseCoverage` must be called on an empty report.')
    }
    this.coverage = new $$Coverage(tree.coverage.toJson())

    return this
  }

  merge(tree) {
    logMerge('-------\nmerge coverage %o', tree.file)
    const $coverage = new $$Coverage(tree.coverage.toJson())

    logMerge(' > merge %d lines', $coverage.lines.length)
    logMerge(' > merge %d methods', $coverage.methods.length)
    logMerge(' > merge %d branches', $coverage.branches.length)
    logMerge(' > coverage %o', $coverage.coverage())
    const _lines = []

    $coverage.lines.forEach(line => {
      const index = findIndex(this.coverage.lines, pick(line, 'pkg', 'classname', 'number'))

      if (index === -1) {
        _lines.push(line)
      } else {
        this.coverage.lines[index].hits += line.hits || 0
      }
    })

    if (_lines.length) {
      logMerge('Inserting %d lines with current report from coverage %s', _lines.length, tree.file)
      this.coverage.lines = this.coverage.lines.concat(_lines)
    }

    const _methods = []

    $coverage.methods.forEach(method => {
      const index = findIndex(this.coverage.methods, pick(method, 'pkg', 'classname', 'name'))

      if (index === -1) {
        _methods.push(method)
      } else {
        // a method has only one line
        this.coverage.methods[index].lines[0].hits += method.lines[0].hits || 0
      }
    })

    if (_methods.length) {
      logMerge('Inserting %d methods with current report from coverage %s', _methods.length, tree.file)
      this.coverage.methods = this.coverage.methods.concat(_methods)
    }

    const _branches = []

    $coverage.branches.forEach(branch => {
      const index = findIndex(this.coverage.branches, pick(branch, 'pkg', 'classname', 'number'))
 
      if (index === -1) {
        _branches.push(branch)
      } else {
        // must use the greater coverage but we can't sum both values
        this.coverage.branches[index].covered = Math.max(branch.covered, this.coverage.branches[index].covered)
      }
    })

    if (_branches.length) {
      logMerge('Inserting %d branches with current report from coverage %s', _branches.length, tree.file)
      this.coverage.branches = this.coverage.branches.concat(_branches)
    }

    logMerge(' > updated coverage %o', this.coverage.coverage())
  }

  toJson() {
    return JSON.stringify(this.coverage, null, 2)
  }

  root() {
    return this.coverage
  }
}

module.exports = CoverageReport
