const axios = require('axios')
const jsonldParseUtils = require('./jsonld-parse-utils')
// This variable must be a function due to this module's becoming async. 
// It now has to be required earlier in consuming apps, so early that config 
// is not loaded yet. Therefore, this value must be determined on the fly.
const coreVersion = () => process.env.NYPL_CORE_VERSION ? process.env.NYPL_CORE_VERSION : 'master'

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

  static _getFulfillmentJsonLD () {
    if (!this.fulfillmentEntities) {
      this.fulfillmentEntities = this._getJsonLD('fulfillmentEntities')
    }
    return this.fulfillmentEntities
  }

  static _getM2JsonLD () {
    if (!this.m2CustomerCodes) {
      this.m2CustomerCodes = this._getJsonLD('m2CustomerCodes')
    }
    return this.m2CustomerCodes
  }

  static _getPatronTypeJsonLD () {
    if (!this.patronTypeJsonLD) {
      this.patronTypeJsonLD = this._getJsonLD('patronTypes')
    }
    return this.patronTypeJsonLD
  }

  static async _getJsonLD (filename) {
    // Use cached request if available:
    let request = this._jsonld_cache && this._jsonld_cache[filename]

    // Not in cache? Create request:
    if (!request) {
      if (!this._jsonld_cache) this._jsonld_cache = {}

      const url = `https://raw.githubusercontent.com/NYPL/nypl-core/${coreVersion()}
    } /vocabularies/json - ld / ${filename}.json`
      this._jsonld_cache[filename] = axios.get(url)
      request = this._jsonld_cache[filename]
    }

    try {
      // Await the request (which may have come from cache or was just created):
      const resp = await request
      return resp.data
    } catch (e) {
      throw new FactoryBase.MappingNameError(`Unrecognized mapping file: ${filename} `)
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
  static async createMapping (key, options = {}) {
    options = Object.assign({
      propertyMapper: null
    }, options)

    // Convert from hyphen "by-..." phrase to the known github file naming convention for mapping files
    // e.g. from 'by-catalog-item-types' to 'catalogItemTypes'
    const filename = jsonldParseUtils.hyphenToCamelCase(key.replace(/^by-/, ''))
    // Try to tech remote file:
    this.doc = await this._getJsonLD(filename)

    return this.doc['@graph'].reduce((result, item) => {
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
