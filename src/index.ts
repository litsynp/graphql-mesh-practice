import Koa from 'koa'
import { createBuiltMeshHTTPHandler } from '../.mesh'
import Router from 'koa-router'

async function main() {
  const app = new Koa()
  const meshHttp = createBuiltMeshHTTPHandler()

  const router = new Router()
  router.get('/health', (ctx: Koa.Context) => {
    ctx.body = 'OK'
  })

  app.use(async (ctx) => {
    const response = await meshHttp.handleNodeRequest(ctx.req, ctx)

    response.headers.forEach((value: string | string[], key: string) => {
      ctx.append(key, value)
    })

    ctx.status = response.status
    ctx.body = response.body
  })

  app.use(router.routes())

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
  })
}

main()
