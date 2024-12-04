import knex from "knex";
import env from "../../../../../server/http/env";
import { db_config } from "./config";

export const governmentDb = knex(db_config.government[env.environment]);

export const logsDb = knex(db_config.government[env.environment]);

export const censusDb = knex(db_config.census[env.environment]);

export const backgroundJobsDb = knex(
  db_config.jobs[env.environment]
);
