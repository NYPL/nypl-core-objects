const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByPatronTypeFactory extends FactoryBase {

  // returns a mapping with Sierra codes at its top-level
  static createMapping () {
    this.patronTypeJSON = this._getPatronTypeJsonLD()['@graph']
    let result = {}

    for (let patronType in this.patronTypeJSON) {
      let accessibleDeliveryLocationTypes = jsonldParseUtils.forcetoFlatArray(this.patronTypeJSON[patronType]['nypl:deliveryLocationAccess'])

      result[patronType] = {
        'label': this.patronTypeJSON[patronType]['skos:prefLabel'],
        'accessibleDeliveryLocationTypes': accessibleDeliveryLocationTypes
      }
    }

    return result
  }
}

module.exports = ByPatronTypeFactory
