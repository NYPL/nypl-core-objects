const request = require('sync-request')
const jsonldParseUtils = require('./jsonld-parse-utils')
const coreVersion = process.env.NYPL_CORE_VERSION ? process.env.NYPL_CORE_VERSION : 'master'

class FactoryBase {
  static _getSierraJsonLD () {
    if (!this.locationsJsonLD) {
      this.locationsJsonLD = JSON.parse(request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/${coreVersion}/vocabularies/json-ld/locations.json`).getBody())
    }
    return this.locationsJsonLD
  }

  static _getRecapJsonLD () {
    if (!this.recapCustomerCodes) {
      this.recapCustomerCodes = JSON.parse(request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/${coreVersion}/vocabularies/json-ld/recapCustomerCodes.json`).getBody())
    }
    return this.recapCustomerCodes
  }

  static _getM2JsonLD () {
    if (!this.m2CustomerCodes) {
      this.m2CustomerCodes = JSON.parse(request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/${coreVersion}/vocabularies/json-ld/m2CustomerCodes.json`).getBody())
    }
    return this.m2CustomerCodes
  }

  static _getPatronTypeJsonLD () {
    if (!this.patronTypeJsonLD) {
      this.patronTypeJsonLD = JSON.parse(request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/${coreVersion}/vocabularies/json-ld/patronTypes.json`).getBody())
    }
    return this.patronTypeJsonLD
  }

  static _getJsonLD (filename) {
    if (this._jsonld_cache && this._jsonld_cache[filename]) {
      return this._jsonld_cache[filename]
    } else {
      if (!this._jsonld_cache) this._jsonld_cache = {}

      let content = null
      try {
        content = request('GET', `https://raw.githubusercontent.com/NYPL/nypl-core/${coreVersion}/vocabularies/json-ld/${filename}.json`).getBody()
      } catch (e) {
        throw new FactoryBase.MappingNameError(`Unrecognized mapping file: ${filename}`)
      }

      this._jsonld_cache[filename] = JSON.parse(content)
      return this._jsonld_cache[filename]
    }
  }

  /**
   * Returns a baseline hash that maps code/id to a minimum field set (just labels, requestable for now)
   *
   * @param {string} key Specifies the mapping to generate (e.g. by-catalog-item-types)
   * @param {hash} options Optional hash of options, which may include the following:
   *  * propertyMapper: Hash mapping property names to a formatting function that takes the entity as sole argument
   *
   * The options.propertyMapper allows you to leverage a baseline mapping
   * but also layer in additional properties extracted however you like.
   *
   * For example, the following generates a baseline mapping for catalog item types
   * with an additional 'locationType' property extracted from nypl:locationType:
   *
   *   FactoryBase.createMapping('by-catalog-item-types', {
   *     propertyMapper: {
   *       locationType: (item) => {
   *         return item['nypl:locationType'] ? jsonldParseUtils.forcetoFlatArray(item['nypl:locationType']) : []
   *       }
   *     }
   *   })
   */
  static createMapping (key, options = {}) {
    options = Object.assign({
      propertyMapper: null
    }, options)

    // Convert from hyphen "by-..." phrase to the known github file naming convention for mapping files
    // e.g. from 'by-catalog-item-types' to 'catalogItemTypes'
    const filename = jsonldParseUtils.hyphenToCamelCase(key.replace(/^by-/, ''))

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
      const mappedFields = {}
      if (item['@id']) mappedFields.id = item['@id']
      if (item['skos:notation']) mappedFields.code = item['skos:notation']
      if (item['skos:prefLabel']) mappedFields.label = item['skos:prefLabel']
      if (item['nypl:requestable']) mappedFields.requestable = jsonldParseUtils._conditional_boolean(item['nypl:requestable'])

      // Extract custom properties based on propertyMapper hash of functions:
      if (options.propertyMapper) {
        Object.keys(options.propertyMapper).forEach((property) => {
          mappedFields[property] = options.propertyMapper[property](item)
        })
      }

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
