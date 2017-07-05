const flatten = require('just-flatten')

module.exports.forcetoFlatArray = (obj) => {
  return flatten([obj])
}

module.exports._conditional_boolean = (entity) => {
  if (entity['@type'] === 'XSD:boolean') {
    let truthyThings = [true, 'true']
    return (truthyThings.indexOf(entity['@value']) >= 0)
  }
  return (entity['@type'] === 'XSD:boolean') ? Boolean(entity['@value']) : entity['@value']
}
