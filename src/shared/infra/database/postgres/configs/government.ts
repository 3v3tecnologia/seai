import env from "../../../../../server/http/env";

const config: { [index: string]: any } = {
  development: {
    client: "pg",
    connection: {
      host: env.database.host,
      port: env.database.port,
      user: env.database.user,
      password: env.database.password,
      database: "government",
      charset: "utf8",
      timezone: "Brazil/East",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "../migrations/government",
      tableName: "knex_migrations",
      extension: "ts",
      database: "government"
    },
    seeds: {
      directory: '../seeds/government', // Directory for seed files (optional)
    }
  },
  production: {
    client: "pg",
    connection: {
      host: env.database.host,
      port: env.database.port,
      database: "government",
      user: env.database.user,
      password: env.database.password,
      charset: "utf8",
      timezone: "Brazil/East",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "../migrations/government",
      tableName: "knex_migrations",
      extension: "ts",
      database: "government"
    },
    seeds: {
      directory: '../seeds/government', // Directory for seed files (optional)
    }
  },
}


export default config[env.environment]
