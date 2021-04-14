const Coverage = require('./cobertura/$coverage')

class Tree {
  constructor () {
    this.coverage = null
  }

  addTag (tag) {
    switch (tag.name) {
      case 'coverage': {
        this.coverage = new Coverage(tag)
        break
      }

      case 'source': {
        this.coverage.addSource(tag)
        break
      }

      case 'package': {
        this.coverage.addPackage(tag)
        break
      }

      case 'class': {
        this.coverage.addClass(tag)
        break
      }

      case 'method': {
        this.coverage.addMethod(tag)
        break
      }

      case 'line': {
        this.coverage.addLine(tag)
        break
      }

      default:
        return null
    }
  }

  closeTag (tag) {
    switch (tag.name) {
      case 'package': {
        this.coverage.closePackage()
        break
      }

      case 'class': {
        this.coverage.closeClass()
        break
      }

      case 'method': {
        this.coverage.closeMethod()
        break
      }

      default:
        return null
    }
  }
}

module.exports = Tree
