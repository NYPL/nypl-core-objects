/* eslint-disable no-unused-expressions */

const expect = require('chai').expect

const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-catalog-item-type', function () {
  before(async function () {
    takeThisPartyOffline()

    this.byCatalogItemType = await require('../nypl-core-objects')('by-catalog-item-type')
  })

  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.byCatalogItemType).to.not.equal(undefined)
    expect(this.byCatalogItemType).to.be.a('object')
    done()
  })

  it('will have "label" & "collectionType" properties for each key', function () {
    expect(Object.keys(this.byCatalogItemType)).to.not.be.empty

    for (const key in this.byCatalogItemType) {
      const catalogItemType = this.byCatalogItemType[key]
      expect(catalogItemType.label).to.be.a('string')
      expect(catalogItemType.collectionType).to.not.be.empty
    }
  })
})
