const ByRecapCustomerCodeFactory = require('./lib/by_recap_customer_code_factory')
const BySierraLocationFactory = require('./lib/by_sierra_location_factory')
const ByPatronTypeFactory = require('./lib/by_patron_type_factory')
const FactoryBase = require('./lib/factory_base')

module.exports = (maptype) => {
  switch (maptype) {
    case 'by-recap-customer-code':
      return ByRecapCustomerCodeFactory.createMapping()
    case 'by-sierra-location':
      return BySierraLocationFactory.createMapping()
    case 'by-patron-type':
      return ByPatronTypeFactory.createMapping()
    default:
      // Attempt to create a basic map based on maptype:
      // Will throw a MappingNameError if unrecognized
      return FactoryBase.createMapping(maptype)
  }
}
