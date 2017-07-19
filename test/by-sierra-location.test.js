let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  let FactoryBase = require('../lib/factory_base')
  let mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  let mockedRecap = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recapCustomerCodes.json'))))
  FactoryBase._getSierraJsonLD = mockedSierra
  FactoryBase._getRecapJsonLD = mockedRecap
}

describe('by-sierra-location', function () {
  before(function () {
    takeThisPartyOffline()
    this.bySierraLocation = require('../nypl-core-objects')('by-sierra-location')
  })

  it('exports a simpleObject', function (done) {
    expect(this.bySierraLocation).to.not.equal(undefined)
    expect(this.bySierraLocation).to.be.a('object')
    done()
  })

  describe('for each sierra location', function () {
    it('has an array of deliveryLocations, each with a code, label locationsApiSlug, and requestable', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        let sierraLocations = this.bySierraLocation[sierraCode].sierraDeliveryLocations

        expect(sierraLocations).to.be.a('array')
        // each delivery location should have these keys
        sierraLocations.forEach(function (sierraLocation) {
          expect(sierraLocation.code).to.not.be.empty
          expect(sierraLocation.label).to.not.be.empty
          // the 'locationsApiSlug' key always exists, but the value is legitimately null some times
          expect('locationsApiSlug' in sierraLocation).to.equal(true)
          expect('requestable' in sierraLocation).to.equal(true)
        })
      })
    })

    it('has a requestable property', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        expect('requestable' in this.bySierraLocation[sierraCode]).to.eql(true)
      })
    })

    it('if it has a recapLocation, that location will have code, label, and eddRequestable properties', function () {
      // get all Sierra Locations as an Array
      let allSierraLocations = Object.keys(this.bySierraLocation).map((key) => this.bySierraLocation[key])

      let locationsWithRecapLocation = allSierraLocations.filter((sierraLocation) => {
        return sierraLocation.recapLocation
      })

      expect(locationsWithRecapLocation).to.not.be.empty

      locationsWithRecapLocation.forEach((location) => {
        expect(location.recapLocation.code).to.be.a('string')
        expect(location.recapLocation.label).to.be.a('string')
        expect(location.recapLocation.eddRequestable).to.be.a('boolean')
      })
    })

    it('has collectionTypes', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        expect(this.bySierraLocation[sierraCode].collectionTypes).to.be.a('array')
        expect(this.bySierraLocation[sierraCode].deliveryLocationTypes).to.be.a('array')
        expect(this.bySierraLocation[sierraCode].collectionTypes).to.not.be.empty
      })
    })
  })
})
