const axios = require('axios')
class NyplSourceMapper {
  constructor (mapping) {
    this.nyplSourceMap = mapping
  }

  /**
   *  Given a discovery identifier (aka "uri"),
   *  e.g. "b12082323", "i123456", "pb98766", "ci2342343"
   *
   *  Returns a hash with:
   *   - `nyplSource`: System/institution identifier. One of sierra-nypl,
   *                   recap-pul, recap-cul, recap-hl
   *   - `type`: Record type. One of bib, item, holding
   *   - `id`: The non-prefixed identifier, e.g. "12082323"
   */
  splitIdentifier (prefixedIdentifier) {
    if (!/^[a-z]+/.test(prefixedIdentifier)) return null

    const nyplSourceMapping = this.nyplSourceMap
    const prefix = prefixedIdentifier.match(/^[a-z]+/)[0]
    const mapping = Object.keys(nyplSourceMapping)
      .map((nyplSource) => Object.assign({}, { nyplSource }, nyplSourceMapping[nyplSource]))
      .find((properties) => {
        return [properties.bibPrefix, properties.itemPrefix, properties.holdingPrefix].includes(prefix)
      })
    // Because this method tends to be be called with destructuring, return {}
    // if prefixedIdentifier is not recognized
    if (!mapping) return {}

    const type = mapping.bibPrefix === prefix
      ? 'bib'
      : mapping.holdingPrefix === prefix
        ? 'holding'
        : 'item'

    return {
      nyplSource: mapping.nyplSource,
      type,
      id: prefixedIdentifier.replace(prefix, '')
    }
  }

  /** Given an nypl source (such as sierra-nypl or recap-pul) returns the matching prefix
   */
  prefix (source, type = 'bib') {
    const nyplSourceMapping = this.nyplSourceMap
    if (!nyplSourceMapping[source]) return ''
    return nyplSourceMapping[source][`${type}Prefix`]
  }
}

let sourceMapperInstance = null

NyplSourceMapper.instance = async () => {
  if (!sourceMapperInstance) {
    sourceMapperInstance = await axios.get(`https://raw.githubusercontent.com/NYPL/nypl-core/${process.env.NYPL_CORE_VERSION || 'master'}/mappings/recap-discovery/nypl-source-mapping.json`).then((resp) => {
      return new NyplSourceMapper(resp.data)
    })
  }
  return sourceMapperInstance
}

// only for testing
NyplSourceMapper.__resetInstance = () => {
  sourceMapperInstance = null
}

module.exports = NyplSourceMapper
