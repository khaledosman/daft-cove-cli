#!/usr/bin/env node
require('dotenv').config()

const program = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')
const { getCLIVersion } = require('./helpers/get-cli-version')
const { Spinner } = require('./helpers/spinner')
const { getTaxForZipCode, makeOrder } = require('./helpers/daft-cove-api-helpers')

initCli()

async function initCli () {
  const version = await getCLIVersion()

  program
    .version(version, '-v, --version')

  program
    .option('-z, --zipCode <zipCode>', 'zip code of the country')
    .option('-s, --subTotal <subTotal>', 'subtotal of the order')
    .description('returns total order sum based on taxes given in specific zipcode')
    .action(async (options) => {
      let { zipCode, subTotal } = program
      subTotal = Number(subTotal)

      const spinner = new Spinner('getting tax rate for given zip code')
      spinner.start()
      try {
        let { tax_rate: taxRate } = await getTaxForZipCode(zipCode)
        // taxRate = Number.parseFloat(taxRate)
        spinner.end()
        const spinner2 = new Spinner('making order')
        const taxTotal = Number(taxRate) / 100 * subTotal
        const total = subTotal + taxTotal
        console.log({ taxTotal, total, taxRate, subTotal })
        const order = await makeOrder({ zipCode, subTotal, taxRate, taxTotal, total })
        console.log(order)
        spinner.end()
        spinner2.end()
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
