/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-patron-type', function () {
  before(async function () {
    takeThisPartyOffline()

    this.byPatronType = await require('../nypl-core-objects')('by-patron-type')
  })
  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.byPatronType).to.not.equal(undefined)
    expect(this.byPatronType).to.be.a('object')
    done()
  })

  it('will have "label" & "accessibleDeliveryLocationTypes" properties for each key', function () {
    expect(Object.keys(this.byPatronType)).to.not.be.empty
    for (const key in this.byPatronType) {
      const patronType = this.byPatronType[key]
      expect(patronType.label).to.be.a('string')
      expect(patronType.accessibleDeliveryLocationTypes).to.be.a('array')
      expect(patronType.accessibleDeliveryLocationTypes).to.not.be.empty
    }
  })
})
