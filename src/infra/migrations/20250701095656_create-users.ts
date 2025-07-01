import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.uuid('session_id').notNullable().unique()
    table
      .timestamp('created_at', { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable()
    table.timestamp('updated_at', { useTz: true })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
