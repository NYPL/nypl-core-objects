let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')
const flatten = require('just-flatten')

function takeThisPartyOffline () {
  let ByRecapCustomerCodeFactory = require('../lib/by_recap_customer_code_factory.js')
  let mockedRecap = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recapCustomerCodes.json'))))
  let mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  ByRecapCustomerCodeFactory._getSierraJsonLD = mockedSierra
  ByRecapCustomerCodeFactory._getRecapJsonLD = mockedRecap
}

describe('by-recap-customer-codes', function () {
  before(function () {
    takeThisPartyOffline()
    this.withSierraDeliveryLocations = []
    this.withoutSierraDeliveryLocations = []
    this.byRecapCustomerCode = require('../nypl-core-objects')('by-recap-customer-codes')

    for (let customerCode in this.byRecapCustomerCode) {
      let entry = this.byRecapCustomerCode[customerCode]
      if (entry['sierraDeliveryLocations'].length > 0) {
        this.withSierraDeliveryLocations.push(entry)
      } else {
        this.withoutSierraDeliveryLocations.push(entry)
      }
    }
  })

  it('gives the customer code\'s sierraLocation', function () {
    let sierraLocation = this.byRecapCustomerCode['NH']['sierraLocation']
    expect(sierraLocation['code']).to.eql('mal')
    expect(sierraLocation['label']).to.eql('SASB - Service Desk Rm 315')
    expect(sierraLocation['locationsApiSlug']).to.equal('general-research-division')
  })

  it('has recap customer codes at its top level')

  describe('for each customer code', function () {
    it('reports eddRequestable as a boolean', function () {
      for (let customerCode in this.byRecapCustomerCode) {
        expect(this.byRecapCustomerCode[customerCode]['eddRequestable']).to.be.a('boolean')
      }
    })

    it('has a non-empty label', function () {
      expect(this.byRecapCustomerCode['NH']['label']).to.not.be.a('undefined')
    })

    it('has a non-empty Array of sierraDeliveryLocations', function () {
      let deliveryLocations = this.byRecapCustomerCode['NH']['sierraDeliveryLocations']
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
  // test that we have some recap customer codes that have sierraDeliveryLocations,
  // and some that don't.
  //
  // Also test that the onces WITH sierraDeliveryLocations have certain keys
  it('parses some recap locations as having delivery locations, others not', function () {
    expect(this.withSierraDeliveryLocations).to.not.be.empty
    expect(this.withoutSierraDeliveryLocations).to.not.be.empty

    let allSierraDeliverLocations = this.withSierraDeliveryLocations.map((x) => { return x['sierraDeliveryLocations'] })
    allSierraDeliverLocations = flatten(allSierraDeliverLocations)
    allSierraDeliverLocations.forEach((deliveryLocation) => {
      expect(deliveryLocation['code']).to.not.be.a('undefined')
      expect(deliveryLocation['label']).to.not.be.a('undefined')
      expect(deliveryLocation['deliveryLocationTypes']).to.be.a('array')
    })
  })
})
