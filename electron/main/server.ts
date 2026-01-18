import { H3, serve } from 'h3'
import { SERVER_PORT } from '../../config'

export async function createServer() {
  const app = new H3({
    debug: true,
  })
  app.all('/api', () => {
    return {
      version: '',
    }
  })

  await serve(app, {
    port: SERVER_PORT,
  }).ready()

  return app
}
