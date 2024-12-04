import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  // Create the 'users' schema if it doesn't exist
  await knex.raw('CREATE SCHEMA IF NOT EXISTS users');

  // Create ENUM types
  await knex.raw(`
    CREATE TYPE users.user_status AS ENUM (
        'pending',
        'registered'
    );
  `);

  await knex.raw(`
    CREATE TYPE users.user_types AS ENUM (
        'admin',
        'standard',
        'irrigant'
    );
  `);

  // Create User table
  await knex.schema.withSchema('users').createTable('User', (table) => {
    table.increments('Id')
      .primary()
      // .withSchema('users')
      .notNullable();

    table.string('Name', 30).nullable();
    table.string('Login', 20).nullable();
    table.string('Email', 254);
    table.string('Password', 254).nullable();

    // Postgres-specific enum types
    table.specificType('Type', 'users.user_types');
    table.specificType('Status', 'users.user_status')
      .defaultTo('pending');

    table.string('Code', 64);

    table.timestamp('CreatedAt')
      .defaultTo(knex.fn.now())
      .notNullable();

    table.timestamp('UpdatedAt')
      .defaultTo(knex.fn.now())
      .notNullable();

    table.timestamp('Deleted_At');
  });

  // Add unique constraints
  await knex.raw(`
    ALTER TABLE users."User"
    ADD CONSTRAINT "User_Code_key" UNIQUE ("Code", "Type");
  `);

  await knex.raw(`
    ALTER TABLE users."User"
    ADD CONSTRAINT "User_Email_key" UNIQUE ("Email", "Type");
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop constraints
  await knex.raw(`
    ALTER TABLE users."User"
    DROP CONSTRAINT IF EXISTS "User_Code_key";
  `);

  await knex.raw(`
    ALTER TABLE users."User"
    DROP CONSTRAINT IF EXISTS "User_Email_key";
  `);

  // Drop table
  await knex.schema.withSchema('users').dropTableIfExists('User');

  // Drop ENUM types
  await knex.raw('DROP TYPE IF EXISTS users.user_status');
  await knex.raw('DROP TYPE IF EXISTS users.user_types');

  // Optionally drop schema if it's now empty
  await knex.raw('DROP SCHEMA IF EXISTS users');
}
