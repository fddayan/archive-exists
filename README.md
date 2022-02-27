# Artifact exists

Checks if an artifact exists and returns the download url to be used with curl.
This is an alternative because the current download artifact does not seem to be working.

```
inputs:
  artifactName:
    required: true
    description: 'The artifact name to check. It could be a regex expression.'
  GITHUB_TOKEN:
    description: 'The GitHub access token (e.g. secrets.GITHUB_TOKEN) used to create or update the comment. This defaults to {{ github.token }}.'
    default: '${{ github.token }}'
    required: false
  ```

  Outputs
  * artifactsFoundLength
  * artifactsFound
  * artifactsData
  * artifactDownloadUrl