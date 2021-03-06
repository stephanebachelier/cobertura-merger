const Coverage = require('./cobertura/$coverage')

class Tree {
  constructor (file) {
    this.coverage = null
    this.file = file
  }

  addTag (tag) {
    switch (tag.name) {
      case 'coverage': {
        this.coverage = new Coverage(tag)
        this.coverage.file = this.file
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

  isEmpty () {
    return !this.coverage.packages.length
  }
}

module.exports = Tree
