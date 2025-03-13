describe("Testes E2E SauceDemo - Validação Menu Lateral", () => {
  beforeEach(() => {
    cy.login();
  });

  it("verifica 'All items' no menu lateral", () => {
    cy.get(".bm-burger-button").click();
    cy.contains("a", "All Items").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
  });

  it("verifica 'About' no menu lateral", () => {
    cy.get(".bm-burger-button").click();
    cy.contains("a", "About").should(
      "have.attr",
      "href",
      "https://saucelabs.com/"
    );
  });

  it("realiza 'Logout' no sistema", () => {
    cy.get(".bm-burger-button").click();
    cy.contains("a", "Logout").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);

    cy.get("#user-name").should("not.have.text");
    cy.get("#password").should("not.have.text");
  });

  // Teste de caso dando erro, devido a um bug na funcionalidade 'Reset App State'.
  // O problema está acontecendo pois o botão "REMOVE" do produto não está retornando ao estado default ("ADD TO CART").
  it("verifica 'Reset App State'", () => {
    cy.addItemToCart(1);

    cy.get(".bm-burger-button").click();
    cy.contains("a", "Reset App State").click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get(".bm-cross-button").click();
    cy.get("span.shopping_cart_badge").should("not.exist");
    cy.contains("button", "REMOVE").should("not.be.visible");
  });
});
