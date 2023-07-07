import env from "../../../../server/http/env";
import knex from "knex";
import { db_config } from "./config";

export const governmentDb = knex(db_config["government"][env.environment]);
export const logsDb = knex(db_config["logs"][env.environment]);
