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

      const scholarRoomCodeObject = this.patronTypeJSON[index]['nypl:scholarRoom']
      const scholarRoom = {}
      if (scholarRoomCodeObject && scholarRoomCodeObject['@id']) {
        scholarRoom.code = scholarRoomCodeObject['@id'].split('nyplLocation:')[1]
        const sierraLocationWithLabel = this.sierraLocationsJSON
          .find((location) => {
            return location['@id'] === scholarRoomCodeObject['@id']
          })
        scholarRoom.label = sierraLocationWithLabel['skos:prefLabel']
      }

      result[this.patronTypeJSON[index]['skos:notation']] = {
        label: this.patronTypeJSON[index]['skos:prefLabel'],
        accessibleDeliveryLocationTypes: accessibleDeliveryLocationTypes
      }
      if (scholarRoom.code && scholarRoom.label) {
        result[this.patronTypeJSON[index]['skos:notation']].scholarRoom = {
          code: scholarRoom.code,
          label: scholarRoom.label
        }
      }
    }

    return result
  }
}

module.exports = ByPatronTypeFactory
