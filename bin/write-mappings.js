#!/usr/bin/env node

// This executable can get more sophisticated in the future.
// Possible improvements are:
//   * Using reflection to not need a manual mapping_files Array
//   * Taking an outputdirectory flag

const fs = require('fs')
const path = require('path')

let mapping_files = [
  'by_patron_type_factory',
  'by_recap_customer_code_factory',
  'by_sierra_location_factory'
]

let filesWritten = []

mapping_files.forEach((mapping_file) => {
  let mapping = require(path.join(__dirname, '..', 'lib', mapping_file)).createMapping()
  let output_file_name = `${mapping_file.replace('_factory', '')}.json`

  fs.writeFile(path.join(__dirname, '..', 'output', output_file_name), JSON.stringify(mapping), function (err) {
    if (err) {
      return console.log(err)
    }
    filesWritten.push(output_file_name)
    console.log(`saving ${output_file_name}`)
  })
})
