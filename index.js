#!/usr/bin/env node
require('dotenv').config()

const program = require('commander')
const figlet = require('figlet')
const { getCLIVersion } = require('./helpers/get-cli-version')
const { Spinner } = require('./helpers/spinner')
const { getTaxForZipCode, makeOrder } = require('./helpers/daft-cove-api-helpers')

initCli()

async function initCli () {
  const version = await getCLIVersion()

  program
    .version(version, '-v, --version')

  program
    .option('-z, --zipCode <zipCode>', 'zipcode')
    .option('-s, --subTotal <subTotal>', 'subtotal')
    .description('creates zipfile for a plugin')
    .action(async (options) => {
      const { zipCode, subTotal } = program
      const spinner = new Spinner('getting tax rate for given zip code')
      spinner.start()
      try {
        const response = await getTaxForZipCode(zipCode)
        console.log(response)
        spinner.update('making order')
        const response2 = await makeOrder({ zipCode, subTotal, taxRate, taxTotal, total })
        spinner.end()
      } catch (err) {
        console.error(err && err.response && err.response.data ? err.response.data : err)
        spinner.end()
        process.exit(1)
      }
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
