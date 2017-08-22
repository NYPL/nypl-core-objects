const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class BySierraLocationFactory extends FactoryBase {

  // returns a mapping with Sierra codes at its top-level
  static createMapping () {
    this.recapLocations = this._getRecapJsonLD()['@graph']

    return this._getSierraJsonLD()['@graph'].reduce((_returnedMap, location) => {
      var code = location['skos:notation']
      var label = location['skos:prefLabel']
      var locationsApiSlug = location['nypl:locationsSlug'] || null

      let sierraDeliveryLocations = []

      // If location appears to have some deliverableTo links:
      if (location['nypl:deliverableTo']) {
        sierraDeliveryLocations = jsonldParseUtils.forcetoFlatArray(location['nypl:deliverableTo'])
          .map((locationReference) => {
            return this._getSierraJsonLD()['@graph'].find((location) => {
              return location['@id'] === locationReference['@id']
            })
          }).map((_sierraLocation) => {
            if (_sierraLocation) {
              return jsonldParseUtils.toSierraLocation(_sierraLocation)
            }
          })
      }

      // THIS location's recap Location, not all sierra locations have recapLocations
      let thisLocationAsRecap = null

      // If location has a recapCustomerCode, build a hash to represent it
      // Make sure it's a plain object and not an array.
      if (location['nypl:recapCustomerCode'] && (typeof location['nypl:recapCustomerCode']) === 'object' && !Array.isArray(location['nypl:recapCustomerCode'])) {
        thisLocationAsRecap = {}

        let thisRecapRecord = this.recapLocations.find((recapLocation) => {
          return recapLocation['@id'] === location['nypl:recapCustomerCode']['@id']
        })

        thisLocationAsRecap['code'] = thisRecapRecord['skos:notation']
        thisLocationAsRecap['label'] = thisRecapRecord['skos:prefLabel']

        thisLocationAsRecap['eddRequestable'] = jsonldParseUtils._conditional_boolean(thisRecapRecord['nypl:eddRequestable'])
      }

      // Get the recapCustomerCode for the Sierra locations we
      // know we're delivering to.
      let recapCodesforSierraDeliverableLocations = sierraDeliveryLocations.map(function (sierraDeliveryLocation) {
        if (sierraDeliveryLocation && sierraDeliveryLocation['nypl:recapCustomerCode']) {
          return sierraDeliveryLocation['nypl:recapCustomerCode']['@id']
        } else {
          return []
        }
      })

      recapCodesforSierraDeliverableLocations = jsonldParseUtils.forcetoFlatArray(recapCodesforSierraDeliverableLocations)

      // Note: This is about to change to .. collectionType?
      // It it isn't set, default to 'Branch'
      let collectionTypes = jsonldParseUtils.forcetoFlatArray(location['nypl:locationType'] || 'Branch')

      _returnedMap[code] = {
        code,
        label,
        locationsApiSlug,
        collectionTypes,
        recapLocation: thisLocationAsRecap,
        sierraDeliveryLocations,
        requestable: jsonldParseUtils._conditional_boolean(location['nypl:requestable']),
        deliveryLocationTypes: jsonldParseUtils.forcetoFlatArray(location['nypl:deliveryLocationType'])
      }
      return _returnedMap
    }, {})
  }

}

module.exports = BySierraLocationFactory
