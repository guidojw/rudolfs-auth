import { Endpoints } from '@octokit/types'
import { injectable } from 'inversify'
import { request } from 'undici'

@injectable()
export default class AuthService {
  public async getRepoPermissions (owner: string, repo: string, token: string): Promise<string[]> {
    const { statusCode, body } = await request(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        method: 'GET',
        headers: {
          authorization: token,
          ['user-agent']: 'rudolfs' // GitHub API requires a user-agent to be set.
        }
      }
    )

    if (statusCode < 200 || statusCode >= 300) {
      return []
    } else {
      const result = await body.json() as Endpoints['GET /repos/{owner}/{repo}']['response']['data']
      if (typeof result.permissions === 'undefined') {
        return []
      }
      return Object.entries(result.permissions)
        .filter(([, state]) => state === true)
        .map(entry => entry[0])
    }
  }
}
