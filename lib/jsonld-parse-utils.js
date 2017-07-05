const flatten = require('just-flatten')

module.exports.forcetoFlatArray = (obj) => {
  return flatten([obj])
}

module.exports._conditional_boolean = (entity) => {
  return (entity['@type'] === 'XSD:boolean') ? Boolean(entity['@value']) : entity['@value']
}

