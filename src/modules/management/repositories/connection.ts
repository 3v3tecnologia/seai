import knex from "knex";
import { db_config } from "../../../infra/database/postgres/connection/config";
import { DATABASES } from "../../../shared/db/tableNames";
import env from "../../../server/http/env";


export const managementDb = knex(
    db_config[DATABASES.MANAGEMENT.DATABASE][env.environment]
);
