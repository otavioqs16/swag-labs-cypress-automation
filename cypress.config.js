const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "eooi8w",
  e2e: {
    baseUrl: "https://www.saucedemo.com/v1",
  },
});
