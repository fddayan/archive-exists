# Artifact exists

Checks if an artifact exists and returns the download url to be used with curl.
This is an alternative because the current download artifact does not seem to be working.

Inputs:
* artifactName
* GITHUB_TOKEN (default ${{ github.token }})

Outputs
* artifactsFoundLength
* artifactsFound
* artifactsData
* artifactDownloadUrl