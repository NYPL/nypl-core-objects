/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  const ByRecapCustomerCodeFactory = require('../lib/by_recap_customer_code_factory.js')
  const mockedRecap = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recapCustomerCodes.json'))))
  const mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  ByRecapCustomerCodeFactory._getSierraJsonLD = mockedSierra
  ByRecapCustomerCodeFactory._getRecapJsonLD = mockedRecap
}

describe('nypl-core-objects', function () {
  before(function () {
    takeThisPartyOffline()
    this.byRecapCustomerCode = require('../nypl-core-objects')('by-recap-customer-code')
  })

  it('exports a simpleObject', function (done) {
    expect(this.byRecapCustomerCode).to.not.equal(undefined)
    expect(this.byRecapCustomerCode).to.be.a('object')
    done()
  })
})
