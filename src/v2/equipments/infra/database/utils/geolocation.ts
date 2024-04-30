import { Knex } from "knex";
import knexPostgis from "knex-postgis";

export const geoLocationExtension = (connection: Knex) => knexPostgis(connection);
