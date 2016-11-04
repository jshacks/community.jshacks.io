import githubClient from 'clients/github'
import firebaseClient from 'clients/firebase'
import handle from 'lib/handle'
import Kefir from 'kefir'

const org = githubClient.org(process.env.GITHUB_ORGANIZATION)
const opts = {
  per_page: 1
}

const stream = handle(org, 'members', opts)
  .flatten()
  .flatMap(x => {
    let user = githubClient.user(x.login)
    let getData = ['info', 'followers', 'repos', 'orgs']
    return Kefir.merge(map(x => handle(user, x), getData))
  })
  .bufferWhile(T)
/*
  .map(pick([
    'id',
    'login',
    'avatar_url',
    'gravatar_id',
    'html_url',
    'name',
    'company',
    'blog',
    'location',
    'email',
    'hireable',
    'bio',
    'created_at',
    'updated_at'
  ]))
  .map(evolve({
    created_at: x => new Date(x).getTime(),
    updated_at: x => new Date(x).getTime(),
  }))
  */
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
