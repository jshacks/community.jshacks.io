/*
import github from 'octonode'
import * as Kefir from 'kefir'

const client = github.client(process.env.GITHUB_TOKEN)
const team = client.team(process.env.TEAM_ID)
const org = client.org('jshacks')
const search = client.search()

const cb = (e, r) => console.log(r)

console.log('Refreshing', process.env.GITHUB_TOKEN, process.env.TEAM_ID)

Kefir.stream(emitter => {
    team.members((e, r) =>{
      if (e) {
        emitter.error(e)
        return
      }
      emitter.emit(r)
    })
  })
  .map(nth(1))
  .flatMap(x => Kefir.fromCallback(finalCb => {
    let user = client.user(x.login)
    console.log(x)
    // user.followers(cb)
    user.following(cb)
    return
    user.repos(cb)
    user.events(cb)
    user.orgs(cb)
  }))
  .onValue(x => {
    console.log(x)
  })



//team.members(cb)
//org.info(cb)
*/

