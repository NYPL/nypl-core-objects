/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

const FactoryBase = require('../lib/factory_base')

function takeThisPartyOffline () {
  // Overwrite FactoryBase._getJsonLD with a stub that returns local json:
  const mockedCatalogItemTypeJSONLD = function () {
    return JSON.parse(fs.readFileSync(path.join(__dirname, './resources/catalogItemTypes.json')))
  }
  sinon.stub(FactoryBase, '_getJsonLD').callsFake(mockedCatalogItemTypeJSONLD)
}

function revertTakingOfPartyOffline () {
  // Restore FactoryBase._getJsonLD to original for other tests:
  FactoryBase._getJsonLD.restore()
}

describe('by-catalog-item-type', function () {
  before(function () {
    takeThisPartyOffline()
    this.byCatalogItemType = require('../nypl-core-objects')('by-catalog-item-type')
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
