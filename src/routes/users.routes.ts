import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../infra/database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = knex('users').select()

    return users
  })

  app.post('/', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const count = await knex('users')
      .select()
      .count('id', { as: 'count' })
      .where('email', email)
      .first()

    if (Number(count?.count) > 0) {
      throw new Error('E-mail já cadastrado')
    }

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })
  })
}
