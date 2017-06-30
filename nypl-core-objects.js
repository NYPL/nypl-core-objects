const request = require('sync-request')

module.exports = (maptype) => {
  if (maptype === 'from-recap-customer-codes') {
    
    let locationsJsonLD = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/locations.json').getBody())
    let recapCustomerCodes = JSON.parse(request('GET', 'https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/recapCustomerCodes.json').getBody())

    // Bring down latest files
    //
    //
    // create the datastructure

    // return the datastructure
    return {}
  }
}
