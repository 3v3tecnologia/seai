import env from "../../../../server/http/env";
import knex from "knex";
import { db_config } from "./config";
import { DATABASES_NAMES } from "../../../../shared/db/tableNames";

export const governmentDb = knex(
  db_config[DATABASES_NAMES.GOVERNMENT][env.environment]
);
export const logsDb = knex(db_config[DATABASES_NAMES.LOGS][env.environment]);

export const censusDb = knex(
  db_config[DATABASES_NAMES.CENSUS][env.environment]
);
export const equipments = knex(
  db_config[DATABASES_NAMES.EQUIPMENTS][env.environment]
);
export const newsletterDb = knex(
  db_config[DATABASES_NAMES.NEWSLETTER.DATABASE][env.environment]
);
