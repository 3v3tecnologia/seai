import knex from "knex";
import { db_config } from "../../../../../shared/external/db/database/postgres/connection/config";
import env from "../../../../../server/http/env";
import { DATABASES } from "../../../../../shared/external/db/tableNames";

export const managementDb = knex(
  db_config[DATABASES.MANAGEMENT.DATABASE][env.environment]
);
