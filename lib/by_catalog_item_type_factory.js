const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByCatalogItemTypeFactory extends FactoryBase {

  /**
   * Returns a mapping for Catalog Item Types
   */
  static createMapping () {
    return super.createMapping('by-catalog-item-types', {
      propertyMapper: {
        collectionType: (item) => {
          let collectionTypes = item['nypl:collectionType'] ? jsonldParseUtils.forcetoFlatArray(item['nypl:collectionType']) : []
          return collectionTypes
        }
      }
    })
  }
}

module.exports = ByCatalogItemTypeFactory
