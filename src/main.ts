// import * as artifact from '@actions/artifact'
import * as core from '@actions/core'
import * as github from '@actions/github'
import {artifactName, githubToken, repo} from './config'
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

      core.setOutput('artifactsFoundLength', artifactsFound.length)
      core.setOutput('artifactsFound', artifactsFound.length > 0)
      core.setOutput('artifactsData', JSON.stringify(artifactsFound))

      const latestArtifact = artifactsFound[0]

      if (latestArtifact) {
        core.setOutput(
          'artifactDownloadUrl',
          latestArtifact.archive_download_url
        )
      }
    } else {
      core.setOutput('artifactsFoundLength', 0)
      core.setOutput('artifactsFound', false)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
