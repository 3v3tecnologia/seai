import knex from "knex";
import { db_config } from "../../../../../infra/database/postgres/connection/config";
import env from "../../../../../server/http/env";
import { DATABASES } from "../../../../../shared/db/tableNames";

export const equipmentsDb = knex(
  db_config[DATABASES.EQUIPMENTS][env.environment]
);
