const request = require('sync-request')
const jsonldParseUtils = require('./jsonld-parse-utils')

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

  static _getJsonLD (filename) {
    if (this._jsonld_cache && this._jsonld_cache[filename]) {
      return this._jsonld_cache[filename]
    } else {
      if (!this._jsonld_cache) this._jsonld_cache = {}

      var content = null
      try {
        content = request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/${filename}.json`).getBody()
      } catch (e) {
        throw new FactoryBase.MappingNameError(`Unrecognized mapping file: ${filename}`)
      }

      this._jsonld_cache[filename] = JSON.parse(content)
      return this._jsonld_cache[filename]
    }
  }

  // returns a base-line hash mapping code/id to a minimum field set (just labels for now)
  static createMapping (key) {
    // Convert from hyphen "by-..." phrase to the known github file naming convention for mapping files
    // e.g. from 'by-catalog-item-types' to 'catalogItemTypes'
    let filename = jsonldParseUtils.hyphenToCamelCase(key.replace(/^by-/, ''))

    // Try to tech remote file:
    this.doc = this._getJsonLD(filename)['@graph']

    return this.doc.reduce((result, item) => {
      // Pick a sensible lookup key:
      let mappingKey = null
      if (item['@id']) {
        mappingKey = item['@id'].split(':').pop()
      } else {
        mappingKey = item['skos:notation']
      }

      // Build a hash of fields one might want mapped:
      let mappedFields = {}
      if (item['@id']) mappedFields.id = item['@id']
      if (item['skos:notation']) mappedFields.code = item['skos:notation']
      if (item['skos:prefLabel']) mappedFields.label = item['skos:prefLabel']

      result[mappingKey] = mappedFields
      return result
    }, {})
  }
}

// Custom error class for reporting unrecognized mapping filenames
FactoryBase.MappingNameError = function (message) {
  this.name = 'MappingNameError'
  this.message = (message || '')
}
FactoryBase.MappingNameError.prototype = Error.prototype

module.exports = FactoryBase
