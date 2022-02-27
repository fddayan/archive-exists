// import * as artifact from '@actions/artifact'
import * as core from '@actions/core'
import * as github from '@actions/github'
import {artifactName, download, githubToken, repo} from './config'
import moment from 'moment'

async function run(): Promise<void> {
  try {
    // const ms: string = core.getInput('milliseconds')
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())

    const octokit = github.getOctokit(githubToken)
    const artifacts = await octokit.request(
      `GET /repos/${repo.owner}/${repo.repo}/actions/artifacts`,
      {
        owner: repo.owner,
        repo: repo.repo
      }
    )

    core.warning('Artifacts found:')
    core.warning(artifacts.data)

    if (artifacts.data && artifacts.data.artifacts) {
      const regex = new RegExp(artifactName)
      let artifactsFound = artifacts.data.artifacts.filter(
        (a: {name: string; expired: boolean}) =>
          a.name.match(regex) && !a.expired
      )

      // const names = artifactsFound.map((a: {name: string}) => a.name).join(',')

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

        core.warning('Artifact info')
        core.warning(artifactUrl)

        const downloadDate = await octokit.request(`GET ${artifactUrl}`, {
          owner: repo.owner,
          repo: repo.repo,
          artifact_id: latestArtifact.id,
          archive_format: 'zip'
        })

        core.warning(downloadDate.data)

        // const artifactClient = artifact.create()
        // const options = {
        //   createArtifactFolder: false
        // }
        // const downloadResponse = await artifactClient.downloadArtifact(
        //   latestArtifact.name,
        //   downloadTo,
        //   options
        // )
        // core.setOutput('artifactName', downloadResponse.artifactName)
        // core.setOutput('downloadPath', downloadResponse.downloadPath)
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
