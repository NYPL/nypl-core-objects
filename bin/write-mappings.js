#!/usr/bin/env node

// This executable can get more sophisticated in the future.
// Possible improvements are:
//   * Using reflection to not need a manual mapping_files Array
//   * Taking an outputdirectory flag

const fs = require('fs')
const path = require('path')
const NyplCoreObjects = require(path.join(__dirname, '..', 'nypl-core-objects'))

const mappingNames = [
  'by_patron_type',
  'by_recap_customer_code',
  'by_sierra_location',
  'by_statuses',
  'by_catalog_item_type',
  'by_fulfillment',
  'by_collection'
]

const filesWritten = []

mappingNames.forEach(async (mappingName) => {
  const dasherizedName = mappingName.replace(/_/g, '-')
  const mapping = await NyplCoreObjects(dasherizedName)
  const outputFileName = `${mappingName}.json`

  fs.writeFile(path.join(__dirname, '..', 'output', outputFileName), JSON.stringify(mapping), function (err) {
    if (err) {
      return console.log(err)
    }
    filesWritten.push(outputFileName)
    console.log(`saving ${outputFileName}`)
  })
})
