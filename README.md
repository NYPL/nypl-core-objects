# NYPL Core Objects

## The Problem

We have a mapping problem. Here's an example:
NYPL and [ReCAP](https://recap.princeton.edu/) have their own set of identifiers
for physical locations here at NYPL.  Different apps refer to these things by different identifiers
but may want to _convert_ or map them to other known identifiers.

[Kate](https://github.com/katesweeney) & [Shawn](https://github.com/orgs/NYPL-discovery/people/saverkamp) have done
tremendous work in [nypl-core](https://github.com/NYPL/nypl-core) to map
these identifiers and create [json-ld](https://en.wikipedia.org/wiki/JSON-LD) representations.

## So What Does This Module Do?

This node module live-loads the json-ld from `NYPL/nypl-core` in and turns them
into very parsable data-structures for use in your app. **This doesn't expose all the mappings yet**,
see the [Supported Object Types](#supported-object-types) section.

## Install

### From Github

```
 "@nypl/nypl-core-objects": "https://github.com/NYPL/nypl-core-objects.git#SOME-TAG-OR-REF"
```

### From NPM

```
"@nypl/nypl-core-objects": "VERSION"
```

## Usage

```javascript
// create a mapping from Sierra codes to Recap Codes
let bySierraLocation = require('@nypl/nypl-core-objects')('by-sierra-location')

// get its ReCAP code
let code = bySierraLocation['mal']['recapLocation']['code']

// get its ReCAP name
let humanName = bySierraLocation['mal']['recapLocation']['label']

// get its ReCAP eddRequestablity
let EddRequestability = bySierraLocation['mal']['recapLocation']['eddRequestable']
```

For a comprehensive list of availability see the implementation of factories mentioned `nypl-core-objects.js`

### Supported Object Types

* Locations (from [locations.json](https://github.com/NYPL/nypl-core/blob/master/vocabularies/json-ld/locations.json) & [recapCustomerCodes.json](https://github.com/NYPL/nypl-core/blob/master/vocabularies/json-ld/recapCustomerCodes.json))

* Patron Types (from [patronTypes.json](https://github.com/NYPL/nypl-core/blob/master/vocabularies/json-ld/patronTypes.json))
## Git Workflow

When you _file_ a PR - it should include a version bump.  
When you _accept_ a PR - you should push a tag named "vTHEVERSION" (e.g. "v1.0.1")
