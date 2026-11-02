# NYPL Core Objects

This Node module loads JSON-LD documents from `NYPL/nypl-core` and turns them into useful lookups for use in your app. These lookups are intentionally simplified representations of the data and do not include all properties in the original JSON-LD documents.

### It Can Also Write Those Mappings To Disk

Some non-JS apps want to use these mappings.
By running: `npm run build-mappings`.
The mappings are written to `./output/`.

Those files can be pushed to S3 so any application can parse them as simple JSON.
This repo may, one day, stop exporting objects and just be a means of generating
JSON artifacts for pushing to S3.

#### Pushing to S3

`npm run deploy-[qa|production]`

This command is `cp`, not `sync`.
It uploads any new or updated files, but does not remove deleted files.

To push a pre-release to S3 for testing, set `NYPL_CORE_VERSION`, e.g.:

`NYPL_CORE_VERSION=v1.0.1a npm run deploy-qa`

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
const nyplCoreObjects = require('@nypl/nypl-core-objects')
const bySierraLocation = await nyplCoreObjects('by-sierra-location')

// get its ReCAP code
let code = bySierraLocation['mal']['recapLocation']['code']

// get its ReCAP name
let humanName = bySierraLocation['mal']['recapLocation']['label']

// get its ReCAP eddRequestablity
let EddRequestability = bySierraLocation['mal']['recapLocation']['eddRequestable']
```

For a comprehensive list of availability see the implementation of factories mentioned `nypl-core-objects.js`

### Nypl-Source-Mapper

A specialized utility is included for translating between prefixed and "split" NYPL identifiers:

```
const NyplSourceMapper = require('@nypl/nypl-core-objects/lib/nypl-source-mapper')
...
const sourceMapper = await NyplSourceMapper.instance()
const { nyplSource, id, type } = sourceMapper.splitIdentifier('b12082323')
```

## Git Workflow

All PRs should target `main`.

Once the PR has been approved and merged, check out the target branch locally and:

1. **Bump the version**:
 - Bump the version number in `package.json`
 - Run `nvm use; npm i` to update `package-lock.json`
 - Update CHANGELOG.md
 - Commit changes
 - Git tag it (e.g. `git tag -a v3.2.0`)
 - Push changes to origin (including tags via `git push --tags`)

2. **Publish changes to NPMJS**:
 - If publishing an update to the default major branch (2.x at writing):
   - Run `npm publish --dry-run` to verify nothing is being packaged that should not be

3. **Optionally publish changes to S3**:
 - To push changes to S3 (i.e. if the changes are needed by non-Node apps):
   - `npm run deploy-[qa|production]`
