import githubClient from 'clients/github'
import firebaseClient from 'clients/firebase'
import handle from 'lib/handleResponse'

const parse = pipe(
  pick([
    'id',
    'name',
    'full_name',
    'private',
    'html_url',
    'description',
    'fork',
    'created_at',
    'updated_at',
    'homepage',
    'stargazers_count',
    'watchers_count',
    'forks_count'
  ]),
  evolve({
    created_at: x => new Date(x).getTime(),
    updated_at: x => new Date(x).getTime(),
  })
)

const store = x =>
  firebaseClient
    .ref('repos')
    .child(x.id)
    .set(x)

const saveRepo = pipe(parse, store)

const succes = map(saveRepo)
const error = err => console.error(err)

githubClient
  .org(process.env.GITHUB_ORGANIZATION)
  .repos(handle(error, succes))
