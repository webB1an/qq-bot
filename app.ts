import express from 'express'
import * as http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import type { Express } from 'express'
import type { Server } from 'http'
import router from './routes'

if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) {
  dotenv.config({ path: './dev.env' })
} else {
  dotenv.config({ path: './prod.env' })
}

import './bot'

console.log('====================================================================')
console.log('PORT', process.env.KDOCS_HASH_PASSWORD)
console.log('====================================================================')

const app: Express = express()
const server: Server = http.createServer(app)
const port = 3333

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log('---------------server is running at port: ---------------', port)
})
