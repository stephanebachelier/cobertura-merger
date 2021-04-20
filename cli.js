const validation = require('./lib/validation')
const merge = require('./lib')

const cli = require('meow')(`
  Usage

  Provide either a directory where partial cobertura files are present :
  $ coberturaMerger /path/to/cobertura/files/directory

  Or provide a list of cobertura files using the '-f' option
  $ coberturaMerger -f /path/to/cobertura/file/1.xml -f /path/to/cobertura/file/2.xml

  Options
  -------
  Provide multiple files:
    --file, -f          a cobertura file report
  Final coverage report:
    --projectRoot, -p   the project root directory to save the generated report (default: current directory)
    --report, -r        the filename of the report (default: cobertura-coverage.xml)

`, {
  // allowUnknownFlags: false,
  flags: {
    projectRoot: {
      type: 'string',
      alias: 'p'
    },
    report: {
      type: 'string',
      alias: 'r',
      default: 'cobertura-coverage.xml'
    },
    file: {
      type: 'string',
      alias: 'f',
      isMultiple: true
    }
  }
})

const run = async () => {
  const options = await validation(cli)

  return merge(options)
}

run()
