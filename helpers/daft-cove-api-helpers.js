const axios = require('axios')
const config = require('../config.json')

const API_URL = process.env.API_URL || config.API_URL
const API_USER = process.env.API_USER || config.API_USER
const API_PASSWORD = process.env.API_PASSWORD || config.API_PASSWORD

const API_TOKEN = Buffer.from(`${API_USER}:${API_PASSWORD}`).toString('base64')

function getTaxForZipCode (zipCode) {
  return axios.get(`${API_URL}/api/tax?zipcode=${zipCode}`, {
    headers: {
      Authorization: `Basic ${API_TOKEN}`
    }
  })
    .then(res => res.data)
}

function makeOrder ({ zipCode, taxRate, subTotal, taxTotal, total }) {
  return axios.post(`${API_URL}/api/order?zipcode=${zipCode}&tax_rate=${taxRate}&sub_total=${subTotal}&tax_total=${taxTotal}&total=${total}`, {}, {
    headers: {
      Authorization: `Basic ${API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(res => res.data)
}

module.exports = { makeOrder, getTaxForZipCode }
