const fs = require('fs-extra')
const path = require('path')
const log = require('debug')('merger:bin')

module.exports = async cli => {
  const { input, flags } = cli
  const [dir] = input
  let files = []

  if (!dir) {
    console.log('`dir` options is required')
    return cli.showHelp(2)
  }

  try {
    const stats = await fs.stat(dir)
    if (!stats.isDirectory()) {
      console.log(`${dir} is not a directory`)
      return cli.showHelp(2)
    }

    files = (await fs.readdir(dir, { withFileTypes: true }))
      .filter(dirent =>
        dirent.isFile() && dirent.name.substr(-3).toLowerCase() === 'xml'
      )
      .map(dirent => path.join(dir, dirent.name))

    log('Found files %o', files)
  } catch (e) {
    log('Error while serching for existing covertura reports : %s', e)
    console.log(`Invalid directory ${dir}`)
    return cli.showHelp(2)
  }

  if (!files.length) {
    console.log(`No files found in ${dir}.`)
    process.exit(1)
  }

  return {
    files,
    projectRoot: flags.projectRoot,
    file: flags.file
  }
}
