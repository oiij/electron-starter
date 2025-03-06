/* eslint-disable no-console */
import { createServer } from 'node:http'
import { createApp, defineEventHandler, readBody, readFormData, toNodeListener } from 'h3'

const HOST = '127.0.0.1'
const PORT = 5679
const app = createApp({
  debug: true,
  onError: (error) => {
    console.error(error)
  },
  onRequest: async (event) => {
    console.log(`${event.method}: ${event.path}`)
  },
})
app.use('/', defineEventHandler(async (event) => {
  const body = await readBody(event)
  return body
}))
app.use('/upload-file', defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const file = formData.get('file')
  console.log(file)

  if (!file)
    return 'No file uploaded'

  return file
}))

const server = createServer(toNodeListener(app))
server.listen(PORT, () => {
  console.info(`server is running at http://${HOST}:${PORT}/`)
})
