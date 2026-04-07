/**
* Prints a list of pickup locations based on what locations and customer
* codes refer to them as pickup locations
*
*/

const locations = require('..')('by-sierra-location')
const recapCustomerCodes = require('..')('by-recap-customer-code')

const unique = (a) => Array.from(new Set(a))

const deliveryLocationsToHoldingLocations = Object.values(locations)
  // Only interested in requestable holding locations:
  .filter((loc) => loc.requestable)
  // Build a hash relating delivery location codes to the holding locations
  // that link to them:
  .reduce((h, loc) => {
    loc.sierraDeliveryLocations
      // Remove null sierraDeliveryLocations:
      .filter((_l) => _l && _l.code)
      // Just get the code:
      .map((_l) => _l.code)
      // Register each delivery location code as linking to this holding
      // location:
      .forEach((deliveryLocationCode) => {
        if (!h[deliveryLocationCode]) {
          h[deliveryLocationCode] = []
        }
        h[deliveryLocationCode] = h[deliveryLocationCode].concat(loc.code)
      })
    return h
  }, {})

const customerCodesToHoldingLocations = Object.entries(recapCustomerCodes)
  .filter(([code, cc]) => [code, cc.sierraDeliveryLocations])
  .reduce((h, [code, cc]) => {
    cc.sierraDeliveryLocations
      // Remove null sierraDeliveryLocations:
      .filter((_l) => _l && _l.code)
      // Just get the code:
      .map((_l) => _l.code)
      .forEach((deliveryLocationCode) => {
        if (!h[deliveryLocationCode]) {
          h[deliveryLocationCode] = []
        }
        h[deliveryLocationCode] = h[deliveryLocationCode].concat(code)
      })
    return h
  }, {})

const isShownByDfe = (label) => {
  const openLocations = '315,300,121,Allen,Wertheim,Noma,217,Cullman,Dorot,Schomburg,Performing,Map'
    .split(',')
    
  return openLocations.some((term) => label.includes(term))
}

const reportOnCode = (code) => {
  const holdingLocations = deliveryLocationsToHoldingLocations[code] || []
  const customerCodes = customerCodesToHoldingLocations[code] || []
  const label = locations[code].label

  console.log(`${code} (${label})`)
  if (holdingLocations.length) console.log(`  Used by ${holdingLocations.length} holding locations: ${holdingLocations}`)
  if (customerCodes.length) console.log(`  Used by ${customerCodes.length} ReCAP customer codes: ${customerCodes}`)
  console.log('')
}

const allDeliveryLocationCodes = unique(
  []
    .concat(Object.keys(deliveryLocationsToHoldingLocations))
    .concat(Object.keys(customerCodesToHoldingLocations))
)
  .sort((c1, c2) => c1 > c2 ? 1 : -1)

const [visible, hidden] = allDeliveryLocationCodes
  .reduce((a, code) => {
    const label = locations[code].label
    const shown = isShownByDfe(label)

    const index = shown ? 0 : 1
    a[index].push(code)
    return a
  }, [[], []])

console.log('Delivery locations hidden by DFE:')
console.log('---------------------------------')
hidden.map(reportOnCode)

console.log('Public delivery locations:')
console.log('--------------------------')
visible.map(reportOnCode)

// console.log(customerCodesToHoldingLocations)
