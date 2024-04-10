
const chai = require('chai')
chai.use(require('chai-as-promised'))
global.expect = chai.expect

const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

const FactoryBase = require('../lib/factory_base')

module.exports.takeThisPartyOffline = () => {
  // Set up sinon mocking on to direct mapping file requests to disc
  const FactoryBase = require('../lib/factory_base')
  sinon.stub(FactoryBase, '_getJsonLD').callsFake((filename) => {
    const jsonPath = path.join(__dirname, `./resources/${filename}.json`)

    if (!fs.existsSync(jsonPath)) {
      return Promise.reject(new FactoryBase.MappingNameError(`Unrecognized mapping file: ${filename}`))
    }

    const doc = JSON.parse(fs.readFileSync(jsonPath))
    return Promise.resolve(doc)
  })
}

module.exports.revertTakingOfPartyOffline = () => {
  // Restore FactoryBase._getJsonLD to original for other tests:
  FactoryBase._getJsonLD.restore()
}
