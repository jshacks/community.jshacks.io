import express from 'express'
import fs from 'fs'

// import users from './scripts/users'

const server = express()
const router = express.Router()

const foo = {
  this_is: 'working'
}

router.all('*', (eq, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(foo))
})

server.use(process.env.BASE_PATH, router)

const app = server.listen(process.env.HOST_PORT)
