import { readFileSync } from 'node:fs'
import { H3, serve } from 'h3'
import { SERVER_PORT } from '../../config'
import icon from '../../resources/icon.png?asset'

export function createServer() {
  const app = new H3({
    debug: true,
  })
  app.get('/api/hello', () => {
    return 'hello world'
  })
  app.get('/api/json', () => {
    return {
      message: 'hello world',
    }
  })
  app.get('/api/icon', (event) => {
    const file = readFileSync(icon)
    event.res.headers.set('Content-Type', 'image/png')
    return file
  })
  serve(app, {
    port: SERVER_PORT,
  })
}
