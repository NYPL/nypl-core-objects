const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByCatalogItemTypeFactory extends FactoryBase {

  /**
   * Returns a mapping for Catalog Item Types
   */
  static createMapping () {
    return super.createMapping('by-catalog-item-types', {
      propertyMapper: {
        locationType: (item) => {
          let locationTypes = item['nypl:locationType'] ? jsonldParseUtils.forcetoFlatArray(item['nypl:locationType']) : []
          return locationTypes
        }
      }
    })
  }
}

module.exports = ByCatalogItemTypeFactory
