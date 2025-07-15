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

    const userEmail = await knex('users').where({ email }).first()

    if (userEmail) {
      return response.status(400).send({ message: 'User already exists' })
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

    return response.status(201).send()
  })

  app.delete('/:id', async (request, response) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)
    await knex('users').where({ id }).delete()
    response.status(200).send()
  })
}
