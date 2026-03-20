const FactoryBase = require('./factory_base')

class ByCheckinCardStatusFactory extends FactoryBase {
  /**
   * Returns a mapping for Checkin Card Statuses
   */
  static createMapping () {
    return super.createMapping('by-checkin-card-statuses', {
      propertyMapper: {
        display: (item) => {
          return item['nypl:display'] ? item['nypl:display']['@value'] === 'true' : false
        }
      }
    })
  }
}

module.exports = ByCheckinCardStatusFactory
