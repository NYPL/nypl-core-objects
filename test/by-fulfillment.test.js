const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')
const FactoryBase = require('../lib/factory_base')

function takeThisPartyOffline () {
  // Overwrite FactoryBase._getJsonLD with a stub that returns local json:
  const mockedFulfillmentJSONLD = function () {
    return JSON.parse(fs.readFileSync(path.join(__dirname, './resources/fulfillment.json')))
  }
  sinon.stub(FactoryBase, '_getFulfillmentJsonLD').callsFake(mockedFulfillmentJSONLD)
}

function revertTakingOfPartyOffline () {
  // Restore FactoryBase.prototype._getJsonLD to original for other tests:
  FactoryBase._getFulfillmentJsonLD.restore()
}

describe('by-catalog-fulfillment', function () {
  before(function () {
    takeThisPartyOffline()
    this.byFulfillment = require('../nypl-core-objects')('by-fulfillment')
  })
  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.byFulfillment).to.not.equal(undefined)
    expect(this.byFulfillment).to.be.a('object')
    done()
  })

  it('will have "label" & "estimatedTime" properties for each key', function () {
    expect(Object.keys(this.byFulfillment)).to.not.deep.equal({})

    for (const key in this.byFulfillment) {
      const fulfillmentEntity = this.byFulfillment[key]
      expect(fulfillmentEntity.label).to.be.a('string')
      expect(fulfillmentEntity.estimatedTime).to.be.a('string')
    }
  })
})
