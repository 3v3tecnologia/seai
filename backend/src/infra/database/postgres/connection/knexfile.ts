import env from "../../../../server/http/env";
import knex from "knex";
import { db_config } from "./config";
import { DATABASES } from "../../../../shared/db/tableNames";

export const governmentDb = knex(
  db_config[DATABASES.GOVERNMENT][env.environment]
);
export const logsDb = knex(db_config[DATABASES.LOGS][env.environment]);

export const censusDb = knex(db_config[DATABASES.CENSUS][env.environment]);
export const equipments = knex(
  db_config[DATABASES.EQUIPMENTS][env.environment]
);
export const newsletterDb = knex(
  db_config[DATABASES.NEWSLETTER.DATABASE][env.environment]
);

export const backgroundJobsDb = knex(
  db_config[DATABASES.BACKGROUND_JOBS.DATABASE][env.environment]
);
