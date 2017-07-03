let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  let ByRecapCustomerCodeFactory = require('../lib/by_recap_customer_code_factory.js')
  let mockedRecap = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recapCustomerCodes.json'))))
  let mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  ByRecapCustomerCodeFactory._getSierraJsonLD = mockedSierra
  ByRecapCustomerCodeFactory._getRecapJsonLD = mockedRecap
}

describe('nypl-core-objects', function () {
  before(function () {
    takeThisPartyOffline()
    this.byRecapCustomerCode = require('../nypl-core-objects')('by-recap-customer-codes')
  })

  it('exports a simpleObject', function (done) {
    expect(this.byRecapCustomerCode).to.not.equal(undefined)
    expect(this.byRecapCustomerCode).to.be.a('object')
    done()
  })

  it('has recap customer codes at its top level')

  describe('for each customer code', function () {
    it('reports eddRequestable as a boolean', function () {
      expect(this.byRecapCustomerCode['NH']['eddRequestable']).to.be.a('boolean')
    })

    it('has a non-empty label', function () {
      expect(this.byRecapCustomerCode['NH']['label']).to.not.be.a('undefined')
    })

    it('has a non-empty Array of sierraDeliveryLocations', function () {
      let deliveryLocations = this.byRecapCustomerCode['NH']['sierraDeliveryLocations']
      expect(deliveryLocations).to.not.be.empty
      deliveryLocations.forEach((deliveryLocation) => {
        expect(deliveryLocation['code']).to.not.be.a('undefined')
        expect(deliveryLocation['label']).to.not.be.a('undefined')
      })
    })
  })
})
