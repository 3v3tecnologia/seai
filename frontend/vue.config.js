const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  // publicPath: "/static/index.html",
  publicPath: "./",
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
                @import "@/assets/styles/scss/index.scss";
            `,
      },
    },
  },
});
