const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class BySierraLocationFactory extends FactoryBase {
  // returns a mapping with Sierra codes at its top-level
  static async createMapping () {
    const [recapLocations, sierraLocations] = await Promise.all([
      this._getRecapJsonLD(),
      this._getSierraJsonLD()
    ])

    return sierraLocations['@graph'].reduce((_returnedMap, location) => {
      const code = location['skos:notation']
      const label = location['skos:prefLabel']
      const locationsApiSlug = location['nypl:locationsSlug'] || null
      const deliverableToResolution = location['nypl:deliverableToResolution']

      let sierraDeliveryLocations = []

      // If location appears to have some deliverableTo links:
      if (location['nypl:deliverableTo']) {
        sierraDeliveryLocations = jsonldParseUtils.forcetoFlatArray(location['nypl:deliverableTo'])
          .map((locationReference) => {
            return sierraLocations['@graph'].find((location) => {
              return location['@id'] === locationReference['@id']
            })
          }).map((_sierraLocation) => {
            if (_sierraLocation) {
              return jsonldParseUtils.toSierraLocation(_sierraLocation)
            }
            return null
          })
      }

      // THIS location's recap Location, not all sierra locations have recapLocations
      let thisLocationAsRecap = null

      // If location has a recapCustomerCode, build a hash to represent it
      // Make sure it's a plain object and not an array.
      if (location['nypl:recapCustomerCode'] && (typeof location['nypl:recapCustomerCode']) === 'object' && !Array.isArray(location['nypl:recapCustomerCode'])) {
        thisLocationAsRecap = {}

        const thisRecapRecord = recapLocations['@graph'].find((recapLocation) => {
          return recapLocation['@id'] === location['nypl:recapCustomerCode']['@id']
        })
        thisLocationAsRecap.code = thisRecapRecord['skos:notation']
        thisLocationAsRecap.label = thisRecapRecord['skos:prefLabel']

        thisLocationAsRecap.eddRequestable = jsonldParseUtils._conditional_boolean(thisRecapRecord['nypl:eddRequestable'])
      }

      // If collectionType isn't set (it should be for all), default to 'Branch'
      const collectionTypes = jsonldParseUtils.forcetoFlatArray(location['nypl:collectionType'] || 'Branch')

      _returnedMap[code] = {
        code,
        label,
        locationsApiSlug,
        collectionTypes,
        recapLocation: thisLocationAsRecap,
        sierraDeliveryLocations,
        requestable: jsonldParseUtils._conditional_boolean(location['nypl:requestable']),
        deliveryLocationTypes: jsonldParseUtils.forcetoFlatArray(location['nypl:deliveryLocationType']),
        deliverableToResolution,
        collectionAccessType: location['nypl:collectionAccessType']
      }
      return _returnedMap
    }, {})
  }
}

module.exports = BySierraLocationFactory
