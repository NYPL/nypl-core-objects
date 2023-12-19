const expect = require('chai').expect
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-catalog-fulfillment', function () {
  before(async function () {
    takeThisPartyOffline()
    this.byFulfillment = await require('../nypl-core-objects')('by-fulfillment')
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
