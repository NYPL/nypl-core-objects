const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class ByPatronTypeFactory extends FactoryBase {
  // returns a mapping with ptype numbers at its top-level
  static createMapping () {
    this.patronTypeJSON = this._getPatronTypeJsonLD()['@graph']
    this.sierraLocationsJSON = this._getSierraJsonLD()['@graph']
    const result = {}
    for (const index in this.patronTypeJSON) {
      const accessibleDeliveryLocationTypes = jsonldParseUtils.forcetoFlatArray(this.patronTypeJSON[index]['nypl:deliveryLocationAccess'])

      const scholarRoomCode = (this.patronTypeJSON[index]['nypl:scholarRoom'])
      let scholarRoomLabel
      if (scholarRoomCode) {
        scholarRoomLabel = this.sierraLocationsJSON
          .find((location) => location['@id'] === scholarRoomCode['@id'])['skos:prefLabel']
      }

      result[this.patronTypeJSON[index]['skos:notation']] = {
        label: this.patronTypeJSON[index]['skos:prefLabel'],
        accessibleDeliveryLocationTypes: accessibleDeliveryLocationTypes
      }
      if (scholarRoomCode && scholarRoomLabel) {
        result[this.patronTypeJSON[index]['skos:notation']].scholarRoom = {
          code: scholarRoomCode,
          label: scholarRoomLabel
        }
      }
    }

    return result
  }
}

module.exports = ByPatronTypeFactory
