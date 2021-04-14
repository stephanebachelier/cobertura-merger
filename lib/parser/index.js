const fs = require('fs-extra')
const saxes = require('saxes')
const log = require('debug')('parser:tree')

const Tree = require('./tree')

const parse = async (file) =>
  new Promise((resolve, reject) => {
    try {
      const parser = new saxes.SaxesParser()
      const tree = new Tree()

      parser.on('opentag', (node) => {
        log('open tag %o', node)
        tree.addTag(node)
      })

      parser.on('closetag', (node) => {
        log('close tag %o', node)
        tree.closeTag(node)
      })

      const rs = fs.createReadStream(file, { encoding: 'utf8' })

      rs.on('data', (data) => {
        log('parse data')
        parser.write(data)
      })

      rs.on('end', () => {
        log('end coverage')
        parser.close()
        resolve(tree)
      })
    } catch (e) {
      reject(e)
    }
  })

module.exports = { parse }
