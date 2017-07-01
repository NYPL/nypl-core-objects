const FromReCapCustomerCodeFactory = require('./lib/from_recap_customer_code_factory.js')

module.exports = (maptype) => {
  if (maptype === 'from-recap-customer-codes') {
    return FromReCapCustomerCodeFactory.mapping()
  }
}
