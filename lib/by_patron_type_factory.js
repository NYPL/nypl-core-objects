const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByPatronTypeFactory extends FactoryBase {

  // returns a mapping with Sierra codes at its top-level
  static createMapping () {
    this.patronTypeJSON = this._getPatronTypeJsonLD()['@graph']
    let result = {}

    for (let index in this.patronTypeJSON) {
      let accessibleDeliveryLocationTypes = jsonldParseUtils.forcetoFlatArray(this.patronTypeJSON[index]['nypl:deliveryLocationAccess'])

      result[this.patronTypeJSON[index]['skos:notation']] = {
        'label': this.patronTypeJSON[index]['skos:prefLabel'],
        'accessibleDeliveryLocationTypes': accessibleDeliveryLocationTypes
      }
    }

    return result
  }
}

module.exports = ByPatronTypeFactory
