const fs = require('fs-extra')
const { startsWith } = require('lodash')
const path = require('path')
const log = require('debug')('merger:bin')

const processDir = async (cli, dir) => {
  try {
    const stats = await fs.stat(dir)
    if (!stats.isDirectory()) {
      console.log(`${dir} is not a directory`)
      return cli.showHelp(2)
    }

    return (await fs.readdir(dir, { withFileTypes: true }))
      .filter(dirent =>
        dirent.isFile() && dirent.name.substr(-3).toLowerCase() === 'xml'
      )
      .map(dirent => path.join(dir, dirent.name))
  } catch (e) {
    console.log(`Invalid directory ${dir}`)
    throw e
  }
}

const processFiles = async (cli, files) => {
  try {
    return (
      await Promise.all(
        files.map(async file => {
          const isFile = (await fs.stat(file)).isFile()

          if (!isFile) {
            console.log(`Invalid file %s (ignored).`, file)
          }

          return isFile ? file : null
        }))
    ).filter(file => file !== null)
  } catch (e) {
    console.log(`File error ${e.toString()}`)
    throw e
  }
}

module.exports = async cli => {
  const { input, flags } = cli
  const [dir] = input
  let files = []

  if (!flags.file && !dir) {
    console.log('Either provide `dir` is required or multiple files')
    return cli.showHelp(2)
  }

  try {
    files = flags.file ? await processFiles(cli, flags.file) : await processDir(cli, dir)

    log('Found files %o', files)
  } catch (e) {
    log('Error while serching for existing covertura reports : %s', e)

    return cli.showHelp(2)
  }

  if (!files.length) {
    console.log(`No files found in ${dir}.`)
    process.exit(1)
  }

  return {
    files,
    projectRoot: flags.projectRoot,
    file: flags.report
  }
}
