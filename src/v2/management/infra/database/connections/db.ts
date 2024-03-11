import knex from "knex";
import { db_config } from "../../../../../infra/database/postgres/connection/config";
import env from "../../../../../server/http/env";
import { DATABASES } from "../../../../../shared/db/tableNames";

export const managementDb = knex(
  db_config[DATABASES.MANAGEMENT.DATABASE][env.environment]
);
