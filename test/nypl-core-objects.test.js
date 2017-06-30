let expect = require('chai').expect

describe('nypl-core-objects', function () {
  it('exports a function that returns an Array', function (done) {
    let objectMaps = require('../nypl-core-objects')('from-recap-customer-codes')
    expect(objectMaps).to.not.equal(undefined)
    expect(objectMaps).to.be.a('object')
    done()
  })
})
