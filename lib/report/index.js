const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const log = require('debug')('report')
const logMerge = require('debug')('report:merge')
const $$Coverage = require('./coverage')

class CoverageReport {
  constructor() {
    this.coverage = null
  }

  parse(coverage) {
    log('parse coverage %o', coverage)
    if (!isEmpty(this.coverage)) {
      throw new Error('`parseCoverage` must be called on an empty report.')
    }
    this.coverage = new $$Coverage(coverage.toJson())

    return this
  }

  merge(coverage) {
    log('merge coverage %o', coverage)
    const $coverage = new $$Coverage(coverage.toJson())

    logMerge('merge %d lines', this.coverage.lines.length)
    this.coverage.lines.forEach((line) => {
      const { pkg, classname, number } = line
      const $line = find($coverage.lines, { pkg, classname, number })

      line.hits += $line.hits
    })

    logMerge('merge %d methods', this.coverage.methods.length)
    this.coverage.methods.forEach((method) => {
      const { pkg, classname, name } = method
      const $method = find($coverage.methods, { pkg, classname, name })

      // a method has only one line
      method.lines[0].hits += $method.lines[0].hits
    })

    logMerge('merge %d branches', this.coverage.branches.length)
    this.coverage.branches.forEach((branch) => {
      const { pkg, classname, number } = branch

      const $branch = find($coverage.branches, { pkg, classname, number })

      // must use the greater coverage but we can't sum both values
      branch.covered = Math.max(branch.covered, $branch.covered)
    })
  }

  toJson() {
    return JSON.stringify(this.coverage, null, 2)
  }

  root() {
    return this.coverage
  }
}

module.exports = CoverageReport
