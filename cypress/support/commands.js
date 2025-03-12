Cypress.Commands.add("login", () => {
  // Arrange - Preparação (Visita a página da aplicação)
  cy.visit(`${Cypress.config("baseUrl")}/index.html`);

  // Act - Ação (Preenche o formuluário e clica para fazer login)
  cy.get("input[name='user-name']").type(Cypress.env("USER_NAME"));
  cy.get("input[name='password']").type(Cypress.env("USER_PASSWORD"), {
    log: false,
  });
  cy.get("input[type='submit']").click();
});

Cypress.Commands.add("addItemToCart", (quantity) => {
  cy.get("button.btn_inventory").then((items) => {
    // Garantindo que o limite sempre será, no máximo, o número total de itens
    const limit = Math.min(quantity, items.length);
    for (let i = 0; i < limit; i++) {
      cy.wrap(items[i]).click();
      cy.wrap(items[i]).should("have.text", "REMOVE"); // Verifica se o texto do botão está sendo atualizado
    }
  });
});

Cypress.Commands.add("removeItemFromCart", (quantity) => {
  cy.get("button.btn_inventory").then((items) => {
    // Filtrando apenas os botões que possuem o texto "REMOVE"
    const removeButtons = [...items].filter((item) =>
      item.innerText.includes("REMOVE")
    );

    // Garantindo que o limite sempre será, no máximo, o número total de itens
    const limit = Math.min(quantity, items.length);
    for (let i = 0; i < limit; i++) {
      cy.wrap(removeButtons[i]).click();
      cy.wrap(removeButtons[i]).should("have.text", "ADD TO CART"); // Verifica se o texto do botão está sendo atualizado
    }
  });
});

Cypress.Commands.add("verifyCheckoutError", () => {
  cy.get("input[type='submit']").click();
  cy.url().should("eq", `${Cypress.config("baseUrl")}/checkout-step-one.html`);
  cy.get("h3[data-test='error']").should("be.visible");
});
