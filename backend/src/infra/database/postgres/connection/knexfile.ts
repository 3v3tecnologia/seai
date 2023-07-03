import env from "../../../../server/http/env";
import knex from "knex";
import { db_config } from "./config";

export default knex(db_config[env.environment]);
