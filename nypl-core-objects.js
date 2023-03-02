const ByRecapCustomerCodeFactory = require('./lib/by_recap_customer_code_factory')
const ByM2CustomerCodeFactory = require('./lib/by_m2_customer_code_factory')
const BySierraLocationFactory = require('./lib/by_sierra_location_factory')
const ByPatronTypeFactory = require('./lib/by_patron_type_factory')
const ByCatalogItemTypeFactory = require('./lib/by_catalog_item_type_factory')
const FactoryBase = require('./lib/factory_base')

module.exports = (maptype) => {
  switch (maptype) {
    case 'by-recap-customer-code':
      return ByRecapCustomerCodeFactory.createMapping()
    case 'by-recap-customer-codes':
      console.warn('\'by-recap-customer-codes\' is DEPRECATED. Use \'by-recap-customer-code\'')
      return ByRecapCustomerCodeFactory.createMapping()
    case 'by-sierra-location':
      return BySierraLocationFactory.createMapping()
    case 'by-patron-type':
      return ByPatronTypeFactory.createMapping()
    case 'by-catalog-item-type':
      return ByCatalogItemTypeFactory.createMapping()
    case 'by-m2-customer-code':
      return ByM2CustomerCodeFactory.createMapping()
    default:
      // Attempt to create a basic map based on maptype:
      // Will throw a MappingNameError if unrecognized
      return FactoryBase.createMapping(maptype)
  }
}
