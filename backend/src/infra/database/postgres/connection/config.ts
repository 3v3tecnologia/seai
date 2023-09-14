import env from "../../../../server/http/env";

export const db_config: { [index: string]: any } = {
  census: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: "census",
        charset: "utf8",
        timezone: "Brazil/East",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
    production: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        database: "census",
        user: env.database.user,
        password: env.database.password,
        charset: "utf8",
        timezone: "Brazil/East",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
  },
  government: {
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
    },
  },
  logs: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: "logs",
        charset: "utf8",
        timezone: "Brazil/East",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
    production: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        database: "logs",
        user: env.database.user,
        password: env.database.password,
        charset: "utf8",
        timezone: "Brazil/East",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
  },
  equipments: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: "equipments",
        charset: "utf8",
        timezone: "Brazil/East",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
    production: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        database: "equipments",
        user: env.database.user,
        password: env.database.password,
        charset: "utf8",
        timezone: "Brazil/East",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
  },
};
