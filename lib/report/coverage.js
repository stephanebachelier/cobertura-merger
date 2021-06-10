const { branchCoverage, lineCoverage } = require('./rate')
const groupBy = require('lodash/groupBy')
const filter = require('lodash/filter')
const get = require('lodash/get')
const clone = require('lodash/clone')

class $$Coverage {
  constructor({ file, sources, classes }) {
    this.file = file
    this.sources = sources

    this.lines = []
    this.methods = []
    this.branches = []

    this.classes = classes.map(({ name, pkg, filename, methods, lines }) => {
      const $branches = []

      const $lines = lines.map((line) => {
        const $line = new $$Line({
          pkg,
          classname: name,
          ...line
        })

        if ($line.branch) {
          $branches.push($line.branch)
        }

        return $line
      })

      const $methods = methods.map(
        (method) =>
          new $$Method({
            pkg,
            classname: name,
            ...method
          })
      )

      this.lines = this.lines.concat($lines)
      this.methods = this.methods.concat($methods)
      this.branches = this.branches.concat($branches)

      return new $$Class({
        pkg,
        name,
        filename
      })
    })
  }

  coverage() {
    return {
      lines: lineCoverage(this.lines),
      branches: branchCoverage(this.branches)
    }
  }

  node() {
    const coverage = this.coverage()

    return {
      node: 'coverage',
      attributes: {
        'lines-valid': coverage.lines.total,
        'lines-covered': coverage.lines.covered,
        'line-rate': coverage.lines.rate,
        'branches-valid': get(coverage, 'branches.total', 0),
        'branches-covered': get(coverage, 'branches.covered', 0),
        'branch-rate': get(coverage, 'branches.rate', 1),
        timestamp: Date.now(),
        complexity: 0,
        version: '0.1'
      }
    }
  }

  getChildren() {
    const pkgs = groupBy(this.classes, 'pkg')

    return {
      node: 'packages',
      children: Object.keys(pkgs).map((name) => {
        return new $$Package({
          name,
          classes: pkgs[name],
          lines: filter(this.lines, {
            pkg: name
          }),
          methods: filter(this.methods, {
            pkg: name
          }),
          branches: filter(this.branches, {
            pkg: name
          })
        })
      })
    }
  }

  visit() {
    return [this.node(), this.getChildren()]
  }
}

class $$Package {
  constructor({ name, classes, lines, methods, branches }) {
    this.name = name
    this.classes = classes
    this.lines = lines
    this.methods = methods
    this.branches = branches
  }

  coverage() {
    return {
      lines: lineCoverage(this.lines),
      branches: branchCoverage(this.branches)
    }
  }

  node() {
    const coverage = this.coverage()

    return {
      node: 'package',
      attributes: {
        name: this.name,
        'line-rate': coverage.lines.rate,
        'branch-rate': coverage.branches.rate
      },
      children: this.getChildren()
    }
  }

  getChildren() {
    return {
      node: 'classes',
      children: this.classes.map(($class) => {
        $class.lines = filter(this.lines, {
          classname: $class.name
        })
        $class.methods = filter(this.methods, {
          classname: $class.name
        })
        $class.branches = filter(this.branches, {
          classname: $class.name
        })

        return $class
      })
    }
  }

  visit() {
    return [this.node(), this.getChildren()]
  }
}

class $$Class {
  constructor({ pkg, name, filename, methods, lines, branches }) {
    this.pkg = pkg
    this.name = name
    this.filename = filename
    this.methods = methods
    this.lines = lines
    this.branches = branches
  }

  coverage() {
    return {
      line: lineCoverage(this.lines),
      branch: branchCoverage(this.branches)
    }
  }

  node() {
    const { line, branch } = this.coverage()

    return {
      node: 'class',
      attributes: {
        name: this.name,
        filename: this.filename,
        'line-rate': line.rate,
        'branch-rate': branch.rate
      },
      children: this.getChildren()
    }
  }

  getChildren() {
    return [
      {
        node: 'methods',
        children: this.methods
      },
      {
        node: 'lines',
        children: this.lines
      }
    ]
  }

  visit() {
    return [this.node(), this.getChildren()]
  }
}

class $$Method {
  constructor({ pkg, classname, name, signature, lines }) {
    this.pkg = pkg
    this.classname = classname
    this.name = name
    this.signature = signature
    this.lines = lines.map(
      (line) =>
        new $$Line({
          pkg,
          classname,
          ...line
        })
    )
  }

  coverage() {
    return {
      hits: this.lines.reduce((acc, { hits }) => acc + hits, 0)
    }
  }

  node() {
    return {
      node: 'method',
      attributes: {
        name: this.name,
        ...this.coverage(),
        signature: this.signature
      },
      children: this.getChildren()
    }
  }

  getChildren() {
    return {
      node: 'lines',
      children: this.lines.map((line) => {
        const o = clone(line)
        o.branch = null
        return o
      })
    }
  }

  visit() {
    return [this.node(), this.getChildren()]
  }
}

const formatBranch = (infos) => {
  if (!infos) {
    return false
  }

  const { covered, total } = infos

  return `${Math.floor((100 * covered) / total)}% (${covered}/${total})`
}

class $$Line {
  constructor({ pkg, classname, number, hits, branch = false }) {
    this.pkg = pkg
    this.classname = classname
    this.number = number
    this.hits = hits

    this.branch = branch
      ? new $$Branch({
          pkg,
          classname,
          number,
          ...branch
        })
      : branch
  }

  node() {
    const attributes = {
      number: this.number,
      hits: this.hits
    }

    if (this.branch !== null) {
      attributes.branch = this.branch ? 'true' : 'false'

      if (this.branch) {
        attributes['condition-coverage'] = formatBranch(this.branch)
      }
    }

    return {
      node: 'line',
      attributes,
      children: this.getChildren()
    }
  }

  getChildren() {
    return null
  }

  visit() {
    return [this.node(), this.getChildren()]
  }
}

class $$Branch {
  constructor({ pkg, classname, number, covered = 0, total = 0 }) {
    this.pkg = pkg
    this.classname = classname
    this.number = number
    this.covered = covered
    this.total = total
  }

  getChildren() {
    return null
  }
}

module.exports = $$Coverage
