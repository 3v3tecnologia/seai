import * as routes from "./routes";

const paths = {};
Object.values(routes).forEach((route) => {
  Object.assign(paths, route);
});
console.log(paths);
export default {
  openapi: "3.0.0",
  info: {
    title: "SEAI-SERVER",
    description: "Documentação do projeto seai.",
    termsOfService: "http://swagger.io/terms/",
    contact: {
      name: "Spinnafre",
      url: "https://github.com/Spinnafre",
      email: "davispenha@gmail.com",
    },
    license: {
      name: "MIT",
      url: "https://www.mit.edu/~amini/LICENSE.md",
    },
    version: "1.0.0",
  },
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
