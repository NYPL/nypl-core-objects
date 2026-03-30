const expect = require('chai').expect
const { takeThisPartyOffline, revertTakingOfPartyOffline } = require('./test-helper')

describe('by-checkin-card-status', function () {
  before(async function () {
    takeThisPartyOffline()
    this.mapping = await require('../nypl-core-objects')('by-checkin-card-status')
  })
  after(revertTakingOfPartyOffline)

  it('exports a simpleObject', function (done) {
    expect(this.mapping).to.not.equal(undefined)
    expect(this.mapping).to.be.a('object')
    done()
  })

  it('will have "label" & "code" & "display" for each key', function () {
    expect(Object.keys(this.mapping)).to.not.deep.equal({})

    for (const key in this.mapping) {
      const entity = this.mapping[key]
      expect(entity.code).to.be.a('string')
      expect(entity.label).to.be.a('string')
      expect(entity.display).to.be.a('boolean')
    }
  })
})
