describe("Testes E2E SauceDemo - Validação Login", () => {
  it("verifica falha ao logar com campos em branco", () => {
    cy.visit(`${Cypress.config("baseUrl")}/index.html`);

    // Ambos os campos em branco
    cy.get("input[type='submit']").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("h3[data-test='error']")
      .should("be.visible")
      .and("contain", "Username is required");

    // Usuário em branco
    cy.get("input[name='password']").type(Cypress.env("USER_PASSWORD"), {
      log: false,
    });
    cy.get("input[type='submit']").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("h3[data-test='error']")
      .should("be.visible")
      .and("contain", "Username is required");

    // Senha em branco
    cy.get("input[name='password']").clear();
    cy.get("input[name='user-name']").type(Cypress.env("USER_NAME"));
    cy.get("input[type='submit']").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("h3[data-test='error']")
      .should("be.visible")
      .and("contain", "Password is required");
  });

  it("verifica falha ao logar com user inválido", () => {
    cy.visit(`${Cypress.config("baseUrl")}/index.html`);

    cy.get("input[name='user-name']").type("user");
    cy.get("input[name='password']").type(Cypress.env("USER_PASSWORD"), {
      log: false,
    });
    cy.get("input[type='submit']").click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("h3[data-test='error']").should("be.visible");
  });

  it("verifica falha ao logar com senha inválida", () => {
    cy.visit(`${Cypress.config("baseUrl")}/index.html`);

    cy.get("input[name='user-name']").type(Cypress.env("USER_NAME"));
    cy.get("input[name='password']").type("senha", {
      log: false,
    });
    cy.get("input[type='submit']").click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("h3[data-test='error']").should("be.visible");
  });

  it("verifica sucesso ao logar", () => {
    cy.login();

    // Assert - Verificação (Garante que o login foi realizado com sucesso)
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.contains("Products").should("be.visible");
  });
});
