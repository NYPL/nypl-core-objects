const FactoryBase = require('./factory_base')

class ByCollectionFactory extends FactoryBase {
  // returns a mapping from collection IDs to holding locations
  static async createMapping () {
    const collections = await this._getCollectionJsonLD()

    return collections['@graph'].reduce((returnMap, collection) => {
      const collectionId = collection['@id']

      // stripping "nyplLocation:" prefix
      const holdingLocations = (Array.isArray(collection.nyplLocation)
        ? collection.nyplLocation
        : collection.nyplLocation
          ? [collection.nyplLocation]
          : []
      ).map((loc) => loc['@id'].split(':').pop())

      returnMap[collectionId] = {
        holdingLocations,
        code: collection['skos:notation'],
        label: collection['skos:prefLabel']
      }

      return returnMap
    }, {})
  }
}

module.exports = ByCollectionFactory
