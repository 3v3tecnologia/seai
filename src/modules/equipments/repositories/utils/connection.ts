import knex from "knex";
import { db_config } from "../../../../infra/database/postgres/connection/config";
import { DATABASES } from "../../../../shared/db/tableNames";
import env from "../../../../server/http/env";

export const equipmentsDb = knex(
    db_config[DATABASES.EQUIPMENTS][env.environment]
);