import * as core from '@actions/core'
import * as github from '@actions/github'
import {artifactName, githubToken, repo} from './config'

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
      const artifactsFound = artifacts.data.artifacts.filter(
        (a: {name: string; expired: boolean}) =>
          a.name.match(regex) && !a.expired
      )

      core.setOutput('artifacts_found_length', artifactsFound.length)
      core.setOutput('artifacts_found', artifactsFound.length > 0)
      core.setOutput('artifacts_data', JSON.stringify(artifacts.data))
    } else {
      core.setOutput('artifacts_found_length', 0)
      core.setOutput('artifacts_found', false)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
