import knex from "knex";
import { db_config } from "./config";
import env from "../../../../../server/http/env";
import { DATABASES } from "../../tableNames";

export const governmentDb = knex(
  db_config[DATABASES.GOVERNMENT][env.environment]
);

export const logsDb = knex(db_config[DATABASES.GOVERNMENT][env.environment]);

export const censusDb = knex(db_config[DATABASES.CENSUS][env.environment]);

export const newsletterDb = knex(
  db_config[DATABASES.NEWSLETTER.DATABASE][env.environment]
);

export const backgroundJobsDb = knex(
  db_config[DATABASES.BACKGROUND_JOBS][env.environment]
);
