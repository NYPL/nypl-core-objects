/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

function takeThisPartyOffline () {
  // Set up sinon mocking on to direct mapping file requests to disc
  const FactoryBase = require('../lib/factory_base')
  sinon.stub(FactoryBase, '_getJsonLD').callsFake((filename) => {
    const jsonPath = path.join(__dirname, `./resources/${filename}.json`)

    if (!fs.existsSync(jsonPath)) throw new FactoryBase.MappingNameError(`Unrecognized mapping file: ${filename}`)

    return JSON.parse(fs.readFileSync(jsonPath))
  })
}

describe('generic-mapping', function () {
  before(function () {
    takeThisPartyOffline()
  })

  it('by-foo-bar triggers MappingNameError error', function (done) {
    const attemptBadMapping = () => require('../nypl-core-objects')('by-foo-bar')
    expect(attemptBadMapping).to.throw('MappingNameError')
    done()
  })

  it('known mapping names exports a simpleObject', function () {
    return Promise.all(['by-catalog-item-types', 'by-datasources', 'by-icode2'].map((phrase) => {
      const mapping = require('../nypl-core-objects')(phrase)
      expect(mapping).to.not.equal(undefined)
      expect(mapping).to.be.a('object')

      return Promise.resolve()
    }))
  })

  it('known mapping names have a "label", "id" property for each key', function () {
    return Promise.all(['by-catalog-item-types', 'by-datasources', 'by-icode2'].map((phrase) => {
      const mapping = require('../nypl-core-objects')(phrase)
      expect(Object.keys(mapping)).to.not.be.empty
      for (const key in mapping) {
        const entity = mapping[key]
        expect(entity.label).to.be.a('string')
        expect(entity.id).to.be.a('string')
      }

      return Promise.resolve()
    }))
  })
})
