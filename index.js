#!/usr/bin/env node

const program = require('commander')
const figlet = require('figlet')
const { getCLIVersion } = require('./helpers/get-cli-version')
const { Spinner } = require('./helpers/spinner')
initCli()

async function initCli () {
  const version = await getCLIVersion()

  program
    .version(version, '-v, --version')

  program
    .option('-z, --zipCode', 'zipcode')
    .option('-s, --subtotal', 'subtotal')
    .description('creates zipfile for a plugin')
    .action((path = './', options) => {
      console.log('building plugin in %s', path)
      const spinner = new Spinner('doing stuff')
      spinner.start()
      setTimeout(() => {
        spinner.update('doing more stuff')
      }, 1000)
      setTimeout(() => spinner.end(), 2000)
    })

  console.log(figlet.textSync('Daft Cove', {
    font: 'Dancing Font',
    horizontalLayout: 'full',
    verticalLayout: 'full'
  }))

  program.parse(process.argv)
  // if no commands/arguments specified, show the help
  if (!process.argv.slice(2).length) {
    program.help()
  }
}
