const ByRecapCustomerCodeFactory = require('./lib/by_recap_customer_code_factory')
const BySierraLocationFactory = require('./lib/by_sierra_location_factory')
const ByPatronTypeFactory = require('./lib/by_patron_type_factory')

module.exports = (maptype) => {
  switch (maptype) {
    case 'by-recap-customer-codes':
      return ByRecapCustomerCodeFactory.createMapping()
    case 'by-sierra-location':
      return BySierraLocationFactory.createMapping()
    case 'by-patron-type':
      return ByPatronTypeFactory.createMapping()
    default:
      throw new Error('NYPL Core Objects: Unrecognized maptype: ' + maptype)
  }
}
