const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "eooi8w",
  e2e: {
    baseUrl: "https://www.saucedemo.com/v1",
    specPattern: [
      '**/login.cy.js',
      '**/productsPage.cy.js',
      '**/sideMenu.cy.js',
      '**/cartAndShop.cy.js'
    ]
  },
});
