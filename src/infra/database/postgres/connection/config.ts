import env from "../../../../server/http/env";
import { DATABASES } from "../../../../shared/db/tableNames";

export const db_config: { [index: string]: any } = {
  census: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: "censo",
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
        database: "censo",
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
  [DATABASES.EQUIPMENTS]: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: DATABASES.EQUIPMENTS,
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
        database: DATABASES.EQUIPMENTS,
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
  [DATABASES.MANAGEMENT.DATABASE]: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: DATABASES.MANAGEMENT.DATABASE,
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
        database: DATABASES.MANAGEMENT.DATABASE,
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
  [DATABASES.NEWSLETTER.DATABASE]: {
    development: {
      client: "pg",
      connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: DATABASES.NEWSLETTER.DATABASE,
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
        database: DATABASES.NEWSLETTER.DATABASE,
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
  [DATABASES.BACKGROUND_JOBS.DATABASE]: {
    development: {
      client: "pg",
      connection: {
        host: env.jobs.host,
        port: env.jobs.port,
        user: env.jobs.user,
        password: env.jobs.password,
        database: DATABASES.BACKGROUND_JOBS.DATABASE,
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
        host: env.jobs.host,
        port: env.jobs.port,
        user: env.jobs.user,
        password: env.jobs.password,
        database: DATABASES.BACKGROUND_JOBS.DATABASE,
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
