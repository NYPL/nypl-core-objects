/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const flatten = require('just-flatten')
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-m2-customer-codes', function () {
  before(async function () {
    takeThisPartyOffline()
    this.withSierraDeliveryLocations = []
    this.withoutSierraDeliveryLocations = []
    this.byM2CustomerCode = await require('../nypl-core-objects')('by-m2-customer-code')

    for (const customerCode in this.byM2CustomerCode) {
      const entry = this.byM2CustomerCode[customerCode]
      if (entry.sierraDeliveryLocations.length > 0) {
        this.withSierraDeliveryLocations.push(entry)
      } else {
        this.withoutSierraDeliveryLocations.push(entry)
      }
    }
  })

  after(revertTakingOfPartyOffline)

  it('gives the customer code\'s sierraLocation', function () {
    const sierraLocation = this.byM2CustomerCode.AC.sierraLocation
    expect(sierraLocation.code).to.eql('malc')
    expect(sierraLocation.label).to.eql('Schwarzman Building - Cullman Center')
    expect(sierraLocation.locationsApiSlug).to.equal('schwarzman')
  })

  describe('for each customer code', function () {
    it('reports requestable as a boolean', function () {
      for (const customerCode in this.byM2CustomerCode) {
        expect(this.byM2CustomerCode[customerCode].requestable).to.be.a('boolean')
      }
    })

    it('has a non-empty label', function () {
      expect(this.byM2CustomerCode.AC.label).to.not.be.a('undefined')
    })

    it('has an Array of sierraDeliveryLocations', function () {
      const deliveryLocations = this.byM2CustomerCode.XS.sierraDeliveryLocations
      expect(deliveryLocations).to.not.be.empty
      deliveryLocations.forEach(function (deliveryLocation) {
        expect(deliveryLocation.code).to.not.be.empty
        expect(deliveryLocation.label).to.not.be.empty
        // Not only should locationsApiSlug exist here. It should have a value
        expect(deliveryLocation.locationsApiSlug).to.not.be.empty
      })
    })
  })

  // in lieu of a brittle test about the results...
  // test that we have some customer codes that have sierraDeliveryLocations,
  // and some that don't.
  //
  // Also test that the ones WITH sierraDeliveryLocations have certain keys
  it('parses some m2 locations as having delivery locations, others not', function () {
    expect(this.withSierraDeliveryLocations).to.not.be.empty
    expect(this.withoutSierraDeliveryLocations).to.not.be.empty

    let allSierraDeliverLocations = this.withSierraDeliveryLocations.map((x) => { return x.sierraDeliveryLocations })
    allSierraDeliverLocations = flatten(allSierraDeliverLocations)
    allSierraDeliverLocations.forEach((deliveryLocation) => {
      expect(deliveryLocation.code).to.not.be.a('undefined')
      expect(deliveryLocation.label).to.not.be.a('undefined')
      expect(deliveryLocation.deliveryLocationTypes).to.be.a('array')
    })
  })
})
