import knex from "knex";

import db_config from "../configs/government";

export const governmentDb = knex(db_config);
