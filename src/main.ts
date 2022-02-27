// import * as artifact from '@actions/artifact'
import * as core from '@actions/core'
import * as github from '@actions/github'
import {artifactName, download, githubToken, repo} from './config'
import moment from 'moment'

async function run(): Promise<void> {
  try {
    const octokit = github.getOctokit(githubToken)
    const artifacts = await octokit.request(
      `GET /repos/${repo.owner}/${repo.repo}/actions/artifacts`,
      {
        owner: repo.owner,
        repo: repo.repo
      }
    )

    if (artifacts.data && artifacts.data.artifacts) {
      const regex = new RegExp(artifactName)
      let artifactsFound = artifacts.data.artifacts.filter(
        (a: {name: string; expired: boolean}) =>
          a.name.match(regex) && !a.expired
      )

      artifactsFound = artifactsFound.sort(
        (a: {created_at: string}, b: {created_at: string}) =>
          moment(b.created_at).diff(moment(a.created_at).format('YYYYMMDD'))
      )

      core.setOutput('artifacts_found_length', artifactsFound.length)
      core.setOutput('artifacts_found', artifactsFound.length > 0)
      core.setOutput('artifacts_data', JSON.stringify(artifactsFound))

      if (download) {
        const latestArtifact = artifactsFound[0]
        const artifactUrl = latestArtifact.archive_download_url.replace(
          'https://api.github.com',
          ''
        )

        await octokit.request(`GET ${artifactUrl}`, {
          owner: repo.owner,
          repo: repo.repo,
          artifact_id: latestArtifact.id,
          archive_format: 'zip'
        })

        core.setOutput(
          'artifactDownloadUrl',
          latestArtifact.archive_download_url
        )
      }
    } else {
      core.setOutput('artifacts_found_length', 0)
      core.setOutput('artifacts_found', false)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
