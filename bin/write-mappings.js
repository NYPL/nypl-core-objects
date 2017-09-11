#!/usr/bin/env node

// This executable can get more sophisticated in the future.
// Possible improvements are:
//   * Using reflection to not need a manual mapping_files Array
//   * Taking an outputdirectory flag

const fs = require('fs')
const path = require('path')
const NyplCoreObjects = require(path.join(__dirname, '..', 'nypl-core-objects'))

let mapping_names = [
  'by_patron_type',
  'by_recap_customer_code',
  'by_sierra_location',
  'by_statuses',
  'by_catalog_item_type'
]

let filesWritten = []

mapping_names.forEach((mapping_name) => {
  let dasherizedName = mapping_name.replace(/_/g, '-')
  console.log(dasherizedName)
  let mapping = NyplCoreObjects(dasherizedName)
  let output_file_name = `${mapping_name}.json`

  fs.writeFile(path.join(__dirname, '..', 'output', output_file_name), JSON.stringify(mapping), function (err) {
    if (err) {
      return console.log(err)
    }
    filesWritten.push(output_file_name)
    console.log(`saving ${output_file_name}`)
  })
})
