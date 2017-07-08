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
})
