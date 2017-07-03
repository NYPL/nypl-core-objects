const ByRecapCustomerCodeFactory = require('./lib/by_recap_customer_code_factory.js')

module.exports = (maptype) => {
  if (maptype === 'by-recap-customer-codes') {
    return ByRecapCustomerCodeFactory.createMapping()
  }
}
