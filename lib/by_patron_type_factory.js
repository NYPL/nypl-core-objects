const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByPatronTypeFactory extends FactoryBase {
  // returns a mapping with Sierra codes at its top-level
  static createMapping () {
    this.patronTypeJSON = this._getPatronTypeJsonLD()['@graph']
    const result = {}

    for (const index in this.patronTypeJSON) {
      const accessibleDeliveryLocationTypes = jsonldParseUtils.forcetoFlatArray(this.patronTypeJSON[index]['nypl:deliveryLocationAccess'])

      result[this.patronTypeJSON[index]['skos:notation']] = {
        label: this.patronTypeJSON[index]['skos:prefLabel'],
        accessibleDeliveryLocationTypes: accessibleDeliveryLocationTypes
      }
    }

    return result
  }
}

module.exports = ByPatronTypeFactory
