/* eslint-disable no-unused-expressions */

const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('generic-mapping', function () {
  before(takeThisPartyOffline)
  after(revertTakingOfPartyOffline)

  it('by-foo-bar triggers MappingNameError error', async () => {
    const attemptBadMapping = require('../nypl-core-objects')('by-foo-bar')
    return expect(attemptBadMapping).to.be.rejected
  })

  it('known mapping names exports a simpleObject', function () {
    return Promise.all(['by-catalog-item-types', 'by-datasources', 'by-icode2'].map(async (phrase) => {
      const mapping = await require('../nypl-core-objects')(phrase)
      expect(mapping).to.not.equal(undefined)
      expect(mapping).to.be.a('object')

      return Promise.resolve()
    }))
  })

  it('known mapping names have a "label", "id" property for each key', async function () {
    return Promise.all(['by-catalog-item-types', 'by-datasources', 'by-icode2'].map(async (phrase) => {
      const mapping = await require('../nypl-core-objects')(phrase)
      expect(Object.keys(mapping)).to.not.be.empty
      for (const key in mapping) {
        const entity = mapping[key]
        expect(entity.label).to.be.a('string')
        expect(entity.id).to.be.a('string')
      }

      return Promise.resolve()
    }))
  })
})
