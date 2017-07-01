let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  let FromReCapCustomerCodeFactory = require('../lib/from_recap_customer_code_factory.js')
  let mockedRecap = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recapCustomerCodes.json'))))
  let mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  FromReCapCustomerCodeFactory._getSierraJsonLD = mockedSierra
  FromReCapCustomerCodeFactory._getRecapJsonLD = mockedRecap
}

describe('nypl-core-objects', function () {
  before(function () {
    takeThisPartyOffline()
    this.objectMaps = require('../nypl-core-objects')('from-recap-customer-codes')
  })

  it('exports a simpleObject', function (done) {
    expect(this.objectMaps).to.not.equal(undefined)
    expect(this.objectMaps).to.be.a('object')
    done()
  })

  it('has recap customer codes at its top level')

  describe('for each customer code', function () {
    // TODO: I don't know if this one belongs in this block
    it('reports it\'s ability to be EDDable')
    it('has a non-empty displayName')
    it('has a non-empty Array of recapDeliveryLocations')
  })
})
