import { FastifyInstance } from 'fastify'
import { string, z } from 'zod'
import { knex } from '../infra/database'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'
export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return response.status(201).send()
    },
  )

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const meals = await knex('meals').where({ user_id: request.user?.id })

    return { meals }
  })

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const paramsSchema = z.object({ id: string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      const meal = knex('meals').where({ id }).first()
      if (!meal) {
        return response.code(404).send({ error: `Meal (${id}) not found` })
      }

      const mealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = mealBodySchema.parse(
        request.body,
      )

      await knex('meals').where({ id }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      })

      return response.code(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const paramsSchema = z.object({ id: string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id }).first()
      if (!meal) {
        return response.code(404).send({ error: `Meal (${id}) not found` })
      }

      await knex('meals').where({ id }).delete()

      return response.status(204).send()
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const userId = request.user?.id

      const meals = await knex('meals')
        .where({ user_id: userId })
        .orderBy('date', 'desc')

      const mealsOnDiet = await knex('meals')
        .where({
          user_id: userId,
          is_on_diet: true,
        })
        .count('id', { as: 'total' })
        .first()

      const mealsOffDiet = await knex('meals')
        .where({
          user_id: userId,
          is_on_diet: false,
        })
        .count('id', { as: 'total' })
        .first()

      const { bestOnDietSequence } = meals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return {
        meals: meals.length,
        mealsOnDiet: mealsOnDiet?.total,
        mealsOffDiet: mealsOffDiet?.total,
        bestOnDietSequence,
      }
    },
  )
}
