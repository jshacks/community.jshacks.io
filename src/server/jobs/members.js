import githubClient from 'server/clients/github'
import firebaseClient from 'server/clients/firebase'
import handle from 'server/lib/handle'
import Kefir from 'kefir'
import yamljs from 'yamljs'

const schema = yamljs.load('/app/src/schema.yml')

const org = githubClient.org(process.env.GITHUB_ORGANIZATION)
const opts = {
  per_page: 1
}

const combineInfo = (info, followers, repos, orgs) => {

  info  = pick(keys(schema.user_info), info)

  info = evolve({
    created_at: x => new Date(x).getTime(),
    updated_at: x => new Date(x).getTime(),
  }, info)

  followers = {
    followers: pipe(
      map(pick(keys(schema.follower))),
      map(x => ([x.id, true])),
      fromPairs
    )(followers)
  }

  repos = {
    repos: pipe(
      map(pick(keys(schema.repo))),
      map(x => ([x.id, x])),
      fromPairs
    )(repos)
  }

  /*
  orgs = {
    orgs: orgs
  }
  */

  return mergeAll([info, followers, repos, orgs])
}

const stream = handle(org, 'members', opts)
  .flatten()
  .flatMap(x => {
    let user = githubClient.user(x.login)
    let getData = ['info', 'followers', 'repos', 'orgs']
    let streams = map(x => handle(user, x), getData)
    return Kefir.combine(streams, combineInfo)
  })
  .onValue(x => console.log(x))

  /*
stream.onValue(x =>
  firebaseClient
  .ref('members_git')
  .child(x.id)
  .set(x)
)
*/

stream.onError(x => console.error(x))
