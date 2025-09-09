/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-collection-id', function () {
  before(async function () {
    takeThisPartyOffline()
    this.byCollection = await require('../nypl-core-objects')('by-collection')
  })

  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.byCollection).to.not.equal(undefined)
    expect(this.byCollection).to.be.a('object')
    done()
  })

  describe('for each collection/division', function () {
    it('has an array of holding location codes', function () {
      Object.keys(this.byCollection).forEach((collection) => {
        const holdingLocations = this.byCollection[collection].holdingLocations
        expect(holdingLocations).to.be.a('array')
      })
    })

    it('will have "label" & "code" properties for each key', function () {
      expect(Object.keys(this.byCollection)).to.not.be.empty
      for (const key in this.byCollection) {
        const collection = this.byCollection[key]
        expect(collection.label).to.be.a('string')
        expect(collection.code).to.be.a('string')
      }
    })
  })
})
