/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const forcetoFlatArray = require('../lib/jsonld-parse-utils').forcetoFlatArray

describe('forcetoFlatArray', function () {
  it('takes anything and turns it into a flat array', function () {
    expect(forcetoFlatArray(1)).to.eql([1])
    expect(forcetoFlatArray([1])).to.eql([1])
    expect(forcetoFlatArray([1, [2], [3, 4, [5]]])).to.eql([1, 2, 3, 4, 5])
    expect(forcetoFlatArray()).to.eql([])
    expect(forcetoFlatArray(false)).to.eql([false])
  })
})
