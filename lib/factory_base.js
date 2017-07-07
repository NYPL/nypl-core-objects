const request = require('sync-request')

class FactoryBase {
  static _getSierraJsonLD () {
    if (!this.locationsJsonLD) {
      this.locationsJsonLD = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/locations.json').getBody())
    }
    return this.locationsJsonLD
  }

  static _getRecapJsonLD () {
    if (!this.recapCustomerCodes) {
      this.recapCustomerCodes = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/recapCustomerCodes.json').getBody())
    }
    return this.recapCustomerCodes
  }

  static _getPatronTypeJsonLD () {
    if (!this.patronTypeJsonLD) {
      this.patronTypeJsonLD = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/patronTypes.json').getBody())
    }
    return this.patronTypeJsonLD
  }
}

module.exports = FactoryBase
