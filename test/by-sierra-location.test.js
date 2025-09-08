/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-sierra-location', function () {
  before(async function () {
    takeThisPartyOffline()

    this.bySierraLocation = await require('../nypl-core-objects')('by-sierra-location')
  })

  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.bySierraLocation).to.not.equal(undefined)
    expect(this.bySierraLocation).to.be.a('object')
    done()
  })

  describe('for each sierra location', function () {
    it('has an array of deliveryLocations, each with a code, label and locationsApiSlug', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        const sierraLocations = this.bySierraLocation[sierraCode].sierraDeliveryLocations

        expect(sierraLocations).to.be.a('array')
        // each delivery location should have these keys
        sierraLocations.forEach(function (sierraLocation) {
          expect(sierraLocation.code).to.not.be.empty
          expect(sierraLocation.label).to.not.be.empty
          // the 'locationsApiSlug' key always exists, but the value is legitimately null some times
          expect('locationsApiSlug' in sierraLocation).to.equal(true)
        })
      })
    })

    it('has a collectionAccessType property', function () {
      Object.keys(this.bySierraLocation)
        .forEach((code) => {
          expect('collectionAccessType' in this.bySierraLocation[code])
            .to.eql(true)
        })
    })

    it('has a deliverableToResolution property', function () {
      Object.keys(this.bySierraLocation)
        .forEach((code) => {
          expect('deliverableToResolution' in this.bySierraLocation[code])
            .to.eql(true)
        })
    })

    it('has a requestable property', function () {
      Object.keys(this.bySierraLocation).forEach((sierraCode) => {
        expect('requestable' in this.bySierraLocation[sierraCode]).to.eql(true)
      })
    })

    it('if it has a recapLocation, that location will have code, label, and eddRequestable properties', function () {
      // get all Sierra Locations as an Array
      const allSierraLocations = Object.keys(this.bySierraLocation).map((key) => this.bySierraLocation[key])

      const locationsWithRecapLocation = allSierraLocations.filter((sierraLocation) => {
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

  describe('location collectionType', function () {
    it('nyplLocation:ft (53rd St) has collectionType "Branch"', function () {
      expect(this.bySierraLocation.ft.collectionTypes).to.be.a('array')
      expect(this.bySierraLocation.ft.collectionTypes).to.have.lengthOf(1)
      expect(this.bySierraLocation.ft.collectionTypes).to.have.members(['Branch'])
    })

    it('nyplLocation:ia (Electronic Material for Adults) has collectionType "Branch", "Research"', function () {
      expect(this.bySierraLocation.ia.collectionTypes).to.be.a('array')
      expect(this.bySierraLocation.ia.collectionTypes).to.have.lengthOf(2)
      expect(this.bySierraLocation.ia.collectionTypes).to.have.members(['Research', 'Branch'])
    })
  })
})
