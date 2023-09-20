import env from "../../../../server/http/env";
import knex from "knex";
import { db_config } from "./config";

export const governmentDb = knex(db_config["government"][env.environment]);
export const logsDb = knex(db_config["logs"][env.environment]);
export const censusDb = knex(db_config["census"][env.environment]);
export const equipments = knex(db_config["equipments"][env.environment]);
