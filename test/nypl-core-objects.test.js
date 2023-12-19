/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('nypl-core-objects', function () {
  before(async function () {
    takeThisPartyOffline()

    this.byRecapCustomerCode = await require('../nypl-core-objects')('by-recap-customer-code')
  })

  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.byRecapCustomerCode).to.not.equal(undefined)
    expect(this.byRecapCustomerCode).to.be.a('object')
    done()
  })
})
