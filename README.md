# Artifact exists

Checks if an artifact exists and returns the download url to be used with curl.
This is an alternative because the current download artifact does not seem to be working.

```
inputs:
  artifactName:
    required: true
    description: 'The artifact name to check. It could be a regex expression.'
  download:
    required: false
    description: 'Should download the artifact'
  downloadTo:
    required: false
    description: 'Where should download the artifact'
  GITHUB_TOKEN:
    description: 'The GitHub access token (e.g. secrets.GITHUB_TOKEN) used to create or update the comment. This defaults to {{ github.token }}.'
    default: '${{ github.token }}'
    required: false
  ```

  Outputs
  * artifacts_found_length
  * artifacts_found
  * artifacts_data
  * artifactDownloadUrl