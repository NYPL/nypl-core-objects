const FactoryBase = require('./factory_base')

class ByFulfillmentFactory extends FactoryBase {
  static createMapping () {
    const fulfillmentEntities = this._getFulfillmentJsonLD()
    return fulfillmentEntities['@graph'].reduce((returnMap, fulfillmentEntity) => {
      // @id is a value like fulfillment:sasb-onsite
      const fulfillmentId = fulfillmentEntity['@id']
      returnMap[fulfillmentId] = {
        estimatedTime: fulfillmentEntity['nypl:estimatedTime'],
        label: fulfillmentEntity['skos:prefLabel']
      }
      return returnMap
    }, {})
  }
}

module.exports = ByFulfillmentFactory
