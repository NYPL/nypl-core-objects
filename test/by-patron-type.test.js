let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  let FactoryBase = require('../lib/factory_base')
  let mockedPatronTypeJSONLD = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/patronTypes.json'))))
  FactoryBase._getPatronTypeJsonLD = mockedPatronTypeJSONLD
}

describe('by-sierra-location', function () {
  before(function () {
    takeThisPartyOffline()
    this.byPatronType = require('../nypl-core-objects')('by-patron-type')
  })

  it('exports a simpleObject', function (done) {
    expect(this.byPatronType).to.not.equal(undefined)
    expect(this.byPatronType).to.be.a('object')
    done()
  })

  it('will have "label" & "accessibleDeliveryLocationTypes" properties for each key', function () {
    expect(Object.keys(this.byPatronType)).to.not.be.empty
    for (let key in this.byPatronType) {
      let patronType = this.byPatronType[key]
      expect(patronType['label']).to.be.a('string')
      expect(patronType['accessibleDeliveryLocationTypes']).to.be.a('array')
      expect(patronType['accessibleDeliveryLocationTypes']).to.not.be.empty
    }
  })
})
