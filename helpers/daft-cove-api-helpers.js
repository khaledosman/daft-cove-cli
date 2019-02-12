const axios = require('axios')

const { API_USER, API_PASSWORD, API_URL } = process.env
console.log({ API_USER, API_PASSWORD, API_URL })
const token = Buffer.from(`${API_USER}:${API_PASSWORD}`).toString('base64')
console.log('token', token)
function getTaxForZipCode (zipCode) {
  return axios.get(`${API_URL}/api/tax`, {
    headers: {
      Authorization: `Basic ${token}`
    }
  })
    .then(res => res.data)
    .then(res => {
      console.log(res)
    })
}

function makeOrder ({ zipCode, taxRate, subTotal, taxTotal, total }) {
  return axios.post(`${API_URL}/api/order`, {
    zipcode: zipCode,
    tax_rate: taxRate,
    sub_total: subTotal,
    tax_total: taxTotal,
    total
  }, {
    headers: {
      Authorization: `Basic ${token}`
    }
  })
    .then(res => res.data)
    .then(res => {
      console.log(res)
    })
}

module.exports = { makeOrder, getTaxForZipCode }
