const validation = require('./validation')
const merge = require('../../lib')

const cli = require('meow')(`
  Usage

  $ coberturaMerger /path/to/cobertura/files

  Options
  -------
    --projectRoot, -p the project root directory to save the generated report (default: current directory)
    --file -f the filename of the report (default: cobertura-coverage.xml)

`, {
  // allowUnknownFlags: false,
  flags: {
    projectRoot: {
      type: 'string',
      alias: 'p'
    },
    file: {
      type: 'string',
      alias: 'f',
      default: 'cobertura-coverage.xml'
    }
  }
})

const run = async () => {
  const options = await validation(cli)

  return merge(options)
}

run()
