let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')
const flatten = require('just-flatten')

function takeThisPartyOffline () {
  let BySierraLocationFactory = require('../lib/by_sierra_location_factory')
  let mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  BySierraLocationFactory._getSierraJsonLD = mockedSierra
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
    it('has an array of deliveryLocations', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        expect(this.bySierraLocation[sierraCode].sierraDeliveryLocations).to.be.a('array')
      })
    })

    it('has either some deliveryLocations or a recapLocation', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        expect(this.bySierraLocation[sierraCode]).to.satisfy(function (location) {
          console.log('location: ', location)
          return location.sierraDeliveryLocations.length > 0 || location.recapDeliveryLocations.length > 0
        })
      })
    })
  })
})
