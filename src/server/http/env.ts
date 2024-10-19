export default {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || "tj67O==5H",
  apiKey: process.env.API_KEY,
  hashSalt: process.env.HASH_SALT,
  environment: process.env.NODE_ENV || "development",
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  messageQueue: process.env.MQ_URL,
};
