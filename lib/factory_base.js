const request = require('sync-request')
const jsonldParseUtils = require('./jsonld-parse-utils')

class FactoryBase {
  static _getSierraJsonLD () {
    if (!this.locationsJsonLD) {
      this.locationsJsonLD = this._getJsonLD('locations')
    }
    return this.locationsJsonLD
  }

  static _getRecapJsonLD () {
    if (!this.recapCustomerCodes) {
      this.recapCustomerCodes = this._getJsonLD('recapCustomerCodes')
    }
    return this.recapCustomerCodes
  }

  static _getPatronTypeJsonLD () {
    if (!this.patronTypeJsonLD) {
      this.patronTypeJsonLD = this._getJsonLD('patronTypes')
    }
    return this.patronTypeJsonLD
  }

  static _getJsonLD (filename) {
    if (this._jsonld_cache && this._jsonld_cache[filename]) {
      return this._jsonld_cache[filename]
    } else {
      if (!this._jsonld_cache) this._jsonld_cache = {}

      var content = null
      let statusCode = null
      try {
        content = request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/master/vocabularies/json-ld/${filename}.json`).getBody()

        // Depending on the response, `sync-request` may throw an error or return a Response object
        // If latter, grab statusCode (just in case it's >= 400)
        statusCode = content.statusCode
      } catch (e) {
        // If `sync-request` throws an error, grab statusCode from that error:
        statusCode = e.statusCode
      }

      // Handle 400+, 500+ status codes
      if (statusCode >= 400 && statusCode < 500) {
        throw new FactoryBase.MappingNameError(`Unrecognized mapping file: ${filename}`)
      } else if (statusCode >= 500) {
        throw new FactoryBase.MappingFileRequestError(`Upstream responded with ${statusCode} for mapping file: ${filename}`)
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
      if (item['nypl:requestable']) mappedFields.requestable = jsonldParseUtils._conditional_boolean(item['nypl:requestable'])

      result[mappingKey] = mappedFields
      return result
    }, {})
  }
}

// Custom error class for reporting upstream errors (e.g. raw.githubusercontent 500)
FactoryBase.MappingFileRequestError = function (message) {
  this.name = 'MappingFileRequestError'
  this.message = (message || '')
}
FactoryBase.MappingFileRequestError.prototype = Error.prototype

// Custom error class for reporting unrecognized mapping filenames
FactoryBase.MappingNameError = function (message) {
  this.name = 'MappingNameError'
  this.message = (message || '')
}
FactoryBase.MappingNameError.prototype = Error.prototype

module.exports = FactoryBase
