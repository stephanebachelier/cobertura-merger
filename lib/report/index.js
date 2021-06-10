const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
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
    log('merge coverage %o', tree)
    const $coverage = new $$Coverage(tree.coverage.toJson())

    logMerge('merge %d lines', this.coverage.lines.length)
    const _lines = []

    $coverage.lines.forEach((line) => {
      const { pkg, classname, number } = line
      const $line = find(this.coverage.lines, { pkg, classname, number })

      if (!$line) {
	log('line no hits issue %o', line) 
        _lines.push(line)
      } else {
        line.hits += $line.hits || 0
      }
    })

    if (_lines.length) {
      log('Inserting %d lines with current report from coverage %s', _lines.length, tree.file)
      $coverage.lines.concat($coverage.lines, _lines)
    }

    const _methods = []

    logMerge('merge %d methods', this.coverage.methods.length)
    $coverage.methods.forEach((method) => {
      const { pkg, classname, name } = method
      const $method = find(this.coverage.methods, { pkg, classname, name })

      if (!$method) {
        _methods.push(method)
      } else {
        // a method has only one line
        method.lines[0].hits += $method.lines[0].hits
      }
    })

    if (_methods.length) {
      log('Inserting %d methods with current report from coverage %s', _methods.length, tree.file)
      $coverage.methods.concat($coverage.methods, _methods)
    }

    const _branches = []

    logMerge('merge %d branches', this.coverage.branches.length)
    $coverage.branches.forEach((branch) => {
      const { pkg, classname, number } = branch

      const $branch = find(this.coverage.branches, { pkg, classname, number })

      if (!$branch) {
        _branches.push(branch)
      } else {
      // must use the greater coverage but we can't sum both values
      branch.covered = Math.max(branch.covered, $branch.covered)
      }
    })

    if (_branches.length) {
      log('Inserting %d branches with current report from coverage %s', _branches.length, tree.file)
      $coverage.branches.concat($coverage.branches, _branches)
    }
  }

  toJson() {
    return JSON.stringify(this.coverage, null, 2)
  }

  root() {
    return this.coverage
  }
}

module.exports = CoverageReport
