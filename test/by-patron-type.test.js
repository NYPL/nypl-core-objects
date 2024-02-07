/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  const FactoryBase = require('../lib/factory_base')
  const mockedPatronTypeJSONLD = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/patronTypes.json'))))
  FactoryBase._getPatronTypeJsonLD = mockedPatronTypeJSONLD
}

describe('by-patron-type', function () {
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
    for (const key in this.byPatronType) {
      const patronType = this.byPatronType[key]
      expect(patronType.label).to.be.a('string')
      expect(patronType.accessibleDeliveryLocationTypes).to.be.a('array')
      expect(patronType.accessibleDeliveryLocationTypes).to.not.be.empty
    }
  })
  it('will have deliverableTo property for scholar p types', function () {
    expect(false).to.be.true
    for (const pType in this.byPatronType) {
      if (this.byPatronType[pType].deliverableTo) {
        expect(false).to.be.true
        expect(this.byPatronType[pType].deliverableTo).to.not.be.empty
        expect(this.byPatronType[pType].code).to.be.a.string
        expect(this.byPatronType[pType].label).to.be.a.string
      }
    }
  })
})
