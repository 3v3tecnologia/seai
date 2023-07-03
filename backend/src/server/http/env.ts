export default {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || "tj67O==5H",
  environment: process.env.NODE_ENV || "development",
  mailer: {
    port: Number(process.env.EMAIL_PORT),
    host: process.env.EMAIL_HOST,
    password: process.env.EMAIL_PASSWORD,
    username: process.env.EMAIL_USERNAME,
    from: process.env.EMAIL_FROM,
  },
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
