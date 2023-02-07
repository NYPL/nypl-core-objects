const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')
class ByM2CustomerCodeFactory extends FactoryBase {
  // returns a mapping with M2 customer codes at its top-level
  static createMapping () {
    const locationsJsonLD = this._getSierraJsonLD()
    const m2CustomerCodes = this._getM2JsonLD()

    const returnedMap = {}

    m2CustomerCodes['@graph'].forEach((m2Location) => {
      let sierraDeliveryLocations = []

      // Some recap locations are have no sierra delivery
      if (m2Location['nypl:deliverableTo']) {
        const deliverableLocations = jsonldParseUtils.forcetoFlatArray(m2Location['nypl:deliverableTo']).map((deliverableTo) => deliverableTo['@id'])
        sierraDeliveryLocations = locationsJsonLD['@graph'].filter((sierraLocation) => {
          return (sierraLocation['nypl:m2CustomerCode'] && deliverableLocations.indexOf(sierraLocation['nypl:m2CustomerCode']['@id']) >= 0)
        })

        sierraDeliveryLocations = sierraDeliveryLocations.map((sierraLocation) => {
          return jsonldParseUtils.toSierraLocation(sierraLocation)
        })
      }

      // This value is if _this_ recap location shows up as the customer code for a sierraLocation.
      const sierraLocation = locationsJsonLD['@graph'].find((sierraLocation) => {
        return sierraLocation['nypl:m2CustomerCode'] && sierraLocation['nypl:m2CustomerCode']['@id'] === m2Location['@id']
      })

      returnedMap[m2Location['skos:notation']] = {
        label: m2Location['skos:prefLabel'],
        requestable: jsonldParseUtils._conditional_boolean(m2Location['nypl:requestable']),
        sierraLocation: sierraLocation ? jsonldParseUtils.toSierraLocation(sierraLocation) : null,
        sierraDeliveryLocations
      }
    })

    return returnedMap
  }
}

module.exports = ByM2CustomerCodeFactory
