const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')
class ByRecapCustomerCodeFactory extends FactoryBase {
  // returns a mapping with ReCap customer codes at its top-level
  static async createMapping () {
    const [locationsJsonLD, recapCustomerCodes] = await Promise.all([
      this._getSierraJsonLD(),
      this._getRecapJsonLD()
    ])

    const returnedMap = {}

    recapCustomerCodes['@graph'].forEach((recapLocation) => {
      let sierraDeliveryLocations = []

      // Some recap locations are have no sierra delivery
      if (recapLocation['nypl:deliverableTo']) {
        const deliverableRecapLocations = jsonldParseUtils.forcetoFlatArray(recapLocation['nypl:deliverableTo']).map((deliverableTo) => deliverableTo['@id'])
        sierraDeliveryLocations = locationsJsonLD['@graph'].filter((sierraLocation) => {
          return (sierraLocation['nypl:recapCustomerCode'] && deliverableRecapLocations.indexOf(sierraLocation['nypl:recapCustomerCode']['@id']) >= 0)
        })

        sierraDeliveryLocations = sierraDeliveryLocations.map((sierraLocation) => {
          return jsonldParseUtils.toSierraLocation(sierraLocation)
        })
      }

      // This value is if _this_ recap location shows up as the customer code for a sierraLocation.
      const sierraLocation = locationsJsonLD['@graph'].find((sierraLocation) => {
        return sierraLocation['nypl:recapCustomerCode'] && sierraLocation['nypl:recapCustomerCode']['@id'] === recapLocation['@id']
      })

      returnedMap[recapLocation['skos:notation']] = {
        label: recapLocation['skos:prefLabel'],
        eddRequestable: jsonldParseUtils._conditional_boolean(recapLocation['nypl:eddRequestable']),
        sierraLocation: sierraLocation ? jsonldParseUtils.toSierraLocation(sierraLocation) : null,
        sierraDeliveryLocations
      }
    })

    return returnedMap
  }
}

module.exports = ByRecapCustomerCodeFactory
