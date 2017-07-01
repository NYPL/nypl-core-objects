const request = require('sync-request')

class FromReCapCustomerCodeFactory {

  // returns a mapping with ReCap customer codes at its top-level
  static mapping () {
    let locationsJsonLD = this._getSierraJsonLD()
    let recapCustomerCodes = this._getRecapJsonLD()
    return recapCustomerCodes
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
}

module.exports = FromReCapCustomerCodeFactory
