import express from 'express'
import fs from 'fs'

import users from './scripts/users'

const PORT = process.env.HOST_PORT

const server = express()
const router = express.Router()

const foo = {
  bam: 'baz'
}

router.all('*', (eq, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(foo))
})

server.use(process.env.BASE_PATH, router)

const app = server.listen(PORT, function () {
  let host = app.address().address
  let port = app.address().port

  console.log('JSHacks community server listening at http://%s:%s', host, port)
})
