#!/usr/bin/env node
require('dotenv').config()

const program = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')
const { getCLIVersion } = require('./helpers/get-cli-version')
const { Spinner } = require('./helpers/spinner')
const { getTaxForZipCode, makeOrder } = require('./helpers/daft-cove-api-helpers')
const validZipCodes = require('./config.json').validZipCodes
initCli()

async function initCli () {
  const version = await getCLIVersion()

  program
    .version(version, '-v, --version')

  program
    .option('-z, --zipCode <zipCode>', 'The zip code of the country, used to get the taxrate')
    .option('-s, --subTotal <subTotal>', 'The subtotal of the order')
    .description(`validates the total sum of an order based on a zipcode's tax rate`)
    .action(async (options) => {
      let { zipCode, subTotal } = program
      subTotal = Number(subTotal)

      if (isNaN(subTotal)) {
        console.error(chalk.red(`subtotal must be a valid number, entered ${subTotal}`))
        process.exit(1)
      }

      if (!validZipCodes.includes(zipCode)) {
        console.warn(chalk.yellow(`WARNING: zipcode is not valid, valid zip codes are ${validZipCodes}`))
        // process.exit(1)
      }

      const spinner = new Spinner(chalk.cyan('getting tax rate for given zip code'))
      const spinner2 = new Spinner(chalk.cyan('making order'))
      spinner.start()
      try {
        let { tax_rate: taxRate } = await getTaxForZipCode(zipCode)
        spinner.end()
        console.log(chalk.blue.italic(`The tax rate for the given zipcode is ${taxRate}%`))
        const taxTotal = Number(taxRate) / 100 * subTotal
        const total = subTotal + taxTotal
        spinner2.start()
        const response = await makeOrder({ zipCode, subTotal: subTotal.toFixed(3), taxRate, taxTotal: taxTotal.toFixed(2), total })
        spinner2.end()
        // console.log(chalk.bold.cyan(JSON.stringify(response, null, 2)))
        console.log(chalk.cyan(response.status_message))
      } catch (err) {
        spinner.end()
        spinner2.end()
        console.error(chalk.red(`Oops something wrong happened: ${err && err.response && err.response.data ? err.response.data : err}`))
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
