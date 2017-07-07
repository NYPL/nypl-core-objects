const jsonldParseUtils = require('./jsonld-parse-utils')
const FactoryBase = require('./factory_base')

class BySierraLocationFactory extends FactoryBase {

  // returns a mapping with Sierra codes at its top-level
  static createMapping () {
    this.recapLocations = this._getRecapJsonLD()['@graph']

    return this._getSierraJsonLD()['@graph'].filter((location) => {
      // Requirements for inclusion in this mapping:
      //  - has a recapCustomerCode
      //  - OR has deliverableTo
      return (location['nypl:recapCustomerCode'] && location['nypl:recapCustomerCode']['@id']) ||
        location['nypl:deliverableTo']
    }).reduce((_returnedMap, location) => {
      var code = location['skos:notation']
      var label = location['skos:prefLabel']

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
              return {
                code: _sierraLocation['skos:notation'],
                label: _sierraLocation['skos:prefLabel']
              }
            }
          })
      }

      // THIS location's recap Location, not all sierra locations have recapLocations
      let thisLocationAsRecap = null

      if (location['nypl:recapCustomerCode']) {
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

      _returnedMap[code] = {
        code,
        label,
        recapLocation: thisLocationAsRecap,
        sierraDeliveryLocations
      }
      return _returnedMap
    }, {})
  }

}

module.exports = BySierraLocationFactory