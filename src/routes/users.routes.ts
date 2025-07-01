import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../infra/database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)
    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })
  })
}
