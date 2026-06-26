const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      "/diabetes": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
    },
  },
});
