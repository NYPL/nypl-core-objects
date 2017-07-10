let expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  let FactoryBase = require('../lib/factory_base')
  let mockedSierra = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/locations.json'))))
  let mockedRecap = sinon.stub().returns(JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recapCustomerCodes.json'))))
  FactoryBase._getSierraJsonLD = mockedSierra
  FactoryBase._getRecapJsonLD = mockedRecap
}

describe('generic-mapping', function () {
  before(function () {
    // takeThisPartyOffline()
    takeThisPartyOffline
    this.catalogItemTypeMapping = require('../nypl-core-objects')('by-catalog-item-types')
  })

  it('by-foo-bar triggers MappingNameError error', function (done) {
    let attemptBadMapping = () => require('../nypl-core-objects')('by-foo-bar')
    expect(attemptBadMapping).to.throw('MappingNameError')
    done()
  })

  it('known mapping names exports a simpleObject', function () {
    return Promise.all(['by-catalog-item-types', 'by-datasources', 'by-icode2'].map((phrase) => {
      let mapping = require('../nypl-core-objects')(phrase)
      expect(mapping).to.not.equal(undefined)
      expect(mapping).to.be.a('object')
    }))
  })

  it('known mapping names have a "label", "id" property for each key', function () {
    return Promise.all(['by-catalog-item-types', 'by-datasources', 'by-icode2'].map((phrase) => {
      let mapping = require('../nypl-core-objects')(phrase)
      expect(Object.keys(mapping)).to.not.be.empty
      for (let key in mapping) {
        let entity = mapping[key]
        expect(entity['label']).to.be.a('string')
        expect(entity['id']).to.be.a('string')
      }
    }))
  })
})
