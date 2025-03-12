const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: Cypress.env("baseUrl"),
  },
});
