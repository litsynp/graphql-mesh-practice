import fastify from 'fastify'
import { createBuiltMeshHTTPHandler } from '../.mesh/index'

const app = fastify()
const meshHttp = createBuiltMeshHTTPHandler()

app.route({
  url: '/graphql',
  method: ['GET', 'POST', 'OPTIONS'],
  async handler(req, reply) {
    // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
    const response = await meshHttp.handleNodeRequest(req, {
      req,
      reply,
    })
    response.headers.forEach((value: unknown, key: string) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    const reader = response.body.getReader()

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      reply.send(value)
    }

    return reply
  },
})

const PORT = parseInt(process.env.PORT as string, 10) || 4000

app.listen({ port: PORT }, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
