import env from "../../../../server/http/env";

export const db_config: { [index: string]: any } = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: env.database.user,
      password: env.database.password,
      database: "government",
      charset: "utf8",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      database: "government",
      user: env.database.user,
      password: env.database.password,
      charset: "utf8",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};