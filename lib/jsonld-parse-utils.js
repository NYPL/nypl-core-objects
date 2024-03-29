const flatten = require('just-flatten')

module.exports.forcetoFlatArray = (obj) => {
  return obj !== undefined ? flatten([obj]) : []
}

module.exports._conditional_boolean = (entity) => {
  if (!entity) {
    return false
  }

  if (entity['@type'] === 'XSD:boolean') {
    const truthyThings = [true, 'true']
    return (truthyThings.indexOf(entity['@value']) >= 0)
  }
  return (entity['@type'] === 'XSD:boolean') ? Boolean(entity['@value']) : entity['@value']
}

module.exports.toSierraLocation = (locationJSON) => {
  return {
    code: locationJSON['skos:notation'],
    label: locationJSON['skos:prefLabel'],
    locationsApiSlug: locationJSON['nypl:locationsSlug'],
    deliveryLocationTypes: module.exports.forcetoFlatArray(locationJSON['nypl:deliveryLocationType'])
  }
}

// Takes a phrase of form 'one-two-three' and converts it to camel (i.e. 'oneTwoThree')
module.exports.hyphenToCamelCase = (phrase) => phrase.split('-').map((word, index) => index === 0 ? word : word[0].toUpperCase() + word.substring(1)).join('')
