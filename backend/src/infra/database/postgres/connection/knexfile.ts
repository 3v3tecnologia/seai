import knex from "knex";

export default knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "root",
    password: "iaes",
    database: "government",
  },
});
