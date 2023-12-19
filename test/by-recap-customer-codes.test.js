/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const flatten = require('just-flatten')
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-recap-customer-codes', function () {
  before(async function () {
    takeThisPartyOffline()
    this.withSierraDeliveryLocations = []
    this.withoutSierraDeliveryLocations = []
    this.byRecapCustomerCode = await require('../nypl-core-objects')('by-recap-customer-code')

    for (const customerCode in this.byRecapCustomerCode) {
      const entry = this.byRecapCustomerCode[customerCode]
      if (entry.sierraDeliveryLocations.length > 0) {
        this.withSierraDeliveryLocations.push(entry)
      } else {
        this.withoutSierraDeliveryLocations.push(entry)
      }
    }
  })

  after(revertTakingOfPartyOffline)

  it('gives the customer code\'s sierraLocation', function () {
    const sierraLocation = this.byRecapCustomerCode.NH.sierraLocation
    expect(sierraLocation.code).to.eql('mal')
    expect(sierraLocation.label).to.eql('Schwarzman Building - Main Reading Room 315')
    expect(sierraLocation.locationsApiSlug).to.equal('general-research-division')
  })

  describe('for each customer code', function () {
    it('reports eddRequestable as a boolean', function () {
      for (const customerCode in this.byRecapCustomerCode) {
        expect(this.byRecapCustomerCode[customerCode].eddRequestable).to.be.a('boolean')
      }
    })

    it('has a non-empty label', function () {
      expect(this.byRecapCustomerCode.NH.label).to.not.be.a('undefined')
    })

    it('has an non-empty Array of sierraDeliveryLocations', function () {
      const deliveryLocations = this.byRecapCustomerCode.NH.sierraDeliveryLocations
      expect(deliveryLocations).to.not.be.empty
      deliveryLocations.forEach(function (deliveryLocation) {
        expect(deliveryLocation.code).to.not.be.empty
        expect(deliveryLocation.label).to.not.be.empty
      })
    })
  })

  // in lieu of a brittle test about the results...
  // test that we have some recap customer codes that have sierraDeliveryLocations,
  // and some that don't.
  //
  // Also test that the ones WITH sierraDeliveryLocations have certain keys
  it('parses some recap locations as having delivery locations, others not', function () {
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

  // Rules for v1.3 of the customer code mappings, opens up more than one room for partner
  // items to be delivered. Non-scholar ptypes can now have PUL and CUL items delivered to
  // SASB locations other than the scholar rooms and including Rm 315 (5 locations total).
  it('shows more than location for non-scholar patron types.', function () {
    const deliveryLocations = this.byRecapCustomerCode.CR.sierraDeliveryLocations

    expect(deliveryLocations).to.be.a('array')
    expect(deliveryLocations.length).to.be.greaterThan(5)
  })
})
