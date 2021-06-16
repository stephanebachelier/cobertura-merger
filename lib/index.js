const parser = require('./parser')
const Report = require('./report')
const CoberturaReport = require('./writer')
const log = require('debug')('merger')

const process = async ({ files, projectRoot, file }) => {
  try {
    const report = new Report()

    log('process files %o', files)
    await files.reduce(async (chain, file) => {
      log('parse coverage file %s', file)
      const tree = await parser.parse(file)

      if (!tree.isEmpty()) {
        !report.coverage ? report.parse(tree) : report.merge(tree)
      }

      return chain
    }, Promise.resolve([]))

    const finalReport = new CoberturaReport({
      report,
      projectRoot,
      file
    })

    finalReport.generate()

    await finalReport.save()
  } catch (e) {
    console.log(e)
    console.log(e.stack)
  }
}

module.exports = process
