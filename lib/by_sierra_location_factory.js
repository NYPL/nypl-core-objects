const request = require('sync-request')
const jsonldParseUtils = require('./jsonld-parse-utils')

class BySierraLocationFactory {

  static createMapping () {
    return this._getSierraJsonLD()['@graph'].filter((location) => {
      // Requirements for inclusion in this mapping:
      //  - has a recapCustomerCode
      //  - OR has deliverableTo
      return (location['nypl:recapCustomerCode'] && location['nypl:recapCustomerCode']['@id']) ||
        location['nypl:deliverableTo']
    }).reduce((_returnedMap, location) => {
      var code = location['skos:notation']
      var label = location['skos:prefLabel']

      var sierraDeliveryLocations = []
      // If location appears to have some deliverableTo links:
      if (location['nypl:deliverableTo']) {
        sierraDeliveryLocations = jsonldParseUtils.forcetoFlatArray(location['nypl:deliverableTo'])
          .map((locationReference) => {
            return this._getSierraJsonLD()['@graph'].find((location) => {
              return location['@id'] === locationReference['@id']
            })
          })
      }
      // This is what's failing:::: Fill it!:q
      var recapDeliveryLocations = []

      _returnedMap[code] = {
        code,
        label,
        sierraDeliveryLocations,
        recapDeliveryLocations
      }
      return _returnedMap
    }, {})
  }

  static _getSierraJsonLD () {
    if (!this.locationsJsonLD) {
      this.locationsJsonLD = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/locations.json').getBody())
      return this.locationsJsonLD
    }
  }
}

module.exports = BySierraLocationFactory
