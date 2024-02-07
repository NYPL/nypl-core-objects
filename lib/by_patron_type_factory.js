const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByPatronTypeFactory extends FactoryBase {
  // returns a mapping with ptype numbers at its top-level
  static createMapping () {
    console.log('spaghetti')
    this.patronTypeJSON = this._getPatronTypeJsonLD()['@graph']
    this.sierraLocationsJSON = this._getSierraJsonLD()['@graph']
    const result = {}
    for (const index in this.patronTypeJSON) {
      const accessibleDeliveryLocationTypes = jsonldParseUtils.forcetoFlatArray(this.patronTypeJSON[index]['nypl:deliveryLocationAccess'])

      const deliverableToCode = (this.patronTypeJSON[index]['nypl:deliverableTo'])
      let deliverableToLabel
      if (deliverableToCode) {
        deliverableToLabel = this.sierraLocationsJSON
          .find((location) => location['@id'] === deliverableToCode)['skos:prefLabel']
      }
      result[this.patronTypeJSON[index]['skos:notation']] = {
        label: this.patronTypeJSON[index]['skos:prefLabel'],
        accessibleDeliveryLocationTypes: accessibleDeliveryLocationTypes
      }
      if (deliverableToCode && deliverableToLabel) {
        result[this.patronTypeJSON[index]['skos:notation']].deliverableTo = {
          code: deliverableToCode,
          label: deliverableToLabel
        }
      }
    }

    return result
  }
}

module.exports = ByPatronTypeFactory
