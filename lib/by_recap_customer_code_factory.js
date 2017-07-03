const request = require('sync-request')
const flatten = require('just-flatten')

class ByRecapCustomerCodeFactory {

  // returns a mapping with ReCap customer codes at its top-level
  static createMapping () {
    let locationsJsonLD = this._getSierraJsonLD()
    let recapCustomerCodes = this._getRecapJsonLD()

    let returnedMap = {}

    recapCustomerCodes['@graph'].map((recapLocation) => {
      let sierraDeliveryLocations = []

      // Some recap locations are have no sierra delivery
      if (recapLocation['nypl:deliverableTo']) {
        let deliverableRecapLocations = flatten([recapLocation['nypl:deliverableTo']]).map((deliverableTo) => deliverableTo['@id'])
        sierraDeliveryLocations = locationsJsonLD['@graph'].filter((sierraLocation) => {
          return (sierraLocation['nypl:recapCustomerCode'] && deliverableRecapLocations.indexOf(sierraLocation['nypl:recapCustomerCode']['@id']) >= 0)
        })

        sierraDeliveryLocations = sierraDeliveryLocations.map((sierraLocation) => {
          return {code: sierraLocation['skos:notation'], label: sierraLocation['skos:prefLabel']}
        })
      }

      returnedMap[recapLocation['skos:notation']] = {
        label: recapLocation['skos:prefLabel'],
        eddRequestable: this._conditional_boolean(recapLocation['nypl:eddRequestable']),
        sierraDeliveryLocations
      }
    })

    return returnedMap
  }

  static _getSierraJsonLD () {
    if (!this.locationsJsonLD) {
      this.locationsJsonLD = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/locations.json').getBody())
      return this.locationsJsonLD
    }
  }

  static _getRecapJsonLD () {
    if (!this.recapCustomerCodes) {
      this.recapCustomerCodes = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/recapCustomerCodes.json').getBody())
      return this.recapCustomerCodes
    }
  }

  static _conditional_boolean (entity) {
    return (entity['@type'] === 'XSD:boolean') ? Boolean(entity['@value']) : entity['@value']
  }
}

module.exports = ByRecapCustomerCodeFactory
