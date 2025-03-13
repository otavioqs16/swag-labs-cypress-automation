// Função que garante estabilidade do teste, garantindo que a quantidade de produtos a serem adicionados/removidos seja adequada
const setLimits = (limit, addQuantity, removeQuantity) => {
  if (addQuantity > limit) addQuantity = limit;
  if (addQuantity > limit) removeQuantity = limit;
  if (removeQuantity > addQuantity) removeQuantity = addQuantity;

  return { addQuantity, removeQuantity };
};

describe("Testes E2E SauceDemo - Validação Carrinho e Fluxos de Compra", () => {
  beforeEach(() => {
    cy.login();
  });

  it("adiciona quantidade de itens ao carrinho", () => {
    const limit = 6; // Quantidade máxima de itens que podem ser adicionados
    let quantity = 2; // Definindo a quantidade de itens que quero adicionar ao carrinho
    if (quantity > limit) quantity = limit; // Limitando a quantidade em relação ao máximo de itens
    cy.addItemToCart(quantity);
    cy.get("span.shopping_cart_badge").should("have.text", quantity.toString());
  });

  it("remove quantidade de itens do carrinho", () => {
    const limit = 6;
    let addQuantity = 4; // Quantidade de itens a serem adicionados ao carrinho
    let removeQuantity = 2; // Quantidade de itens a serem removidos do carrinho

    const settingLimits = setLimits(limit, addQuantity, removeQuantity);

    // Adicionando itens ao carrinho
    cy.addItemToCart(settingLimits.addQuantity);

    // Armazenando a quantidade de itens adicionados ao carrinho
    let cartItens, showCartItens;
    cy.get("span.shopping_cart_badge")
      .invoke("text")
      .then((quantityItens) => {
        cartItens = parseInt(quantityItens);
        showCartItens = cartItens - settingLimits.removeQuantity; // Verificando a quantidade de itens restantes no carrinho
        cy.removeItemFromCart(settingLimits.removeQuantity); // Removendo itens do carrinho

        // Verificando a quantidade de itens exibidas no carrinho
        {
          showCartItens === 0
            ? cy.get("span.shopping_cart_badge").should("not.exist")
            : cy
                .get("span.shopping_cart_badge")
                .should("have.text", showCartItens);
        }
      });
  });

  it("remove item na tela do carrinho e volta para tela de produtos", () => {
    const limit = 6;
    let addQuantity = 3;
    let removeQuantity = 2;

    const settingLimits = setLimits(limit, addQuantity, removeQuantity);

    let showCartItens =
      settingLimits.addQuantity - settingLimits.removeQuantity;

    cy.addItemToCart(settingLimits.addQuantity);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.get(".cart_button").then((removeBtn) => {
      for (let i = 0; i < settingLimits.removeQuantity; i++) {
        cy.wrap(removeBtn[i]).click();
      }
      {
        showCartItens === 0
          ? cy.get("span.shopping_cart_badge").should("not.exist")
          : cy
              .get("span.shopping_cart_badge")
              .should("have.text", showCartItens);
      }
    });

    cy.contains("a", "Continue Shopping").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get("span.shopping_cart_badge").should("have.text", showCartItens);
  });

  it("acessando item no carrinho", () => {
    cy.addItemToCart(1);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.get(".inventory_item_name").click();
    cy.url().should(
      "include",
      `${Cypress.config("baseUrl")}/inventory-item.html`
    );
    cy.get(".shopping_cart_badge").should("have.text", "1");
    cy.contains("button", "REMOVE").should("be.visible");

    cy.get(".inventory_details_back_button").click({ force: true });
    cy.url().should("eq", `${Cypress.config("baseUrl")}/cart.html`);
    cy.get(".shopping_cart_badge").should("have.text", "1");
  });

  it("clica no produto e adiciona no carrinho", () => {
    cy.get(".inventory_item_name").first().click();
    cy.url().should(
      "include",
      `${Cypress.config("baseUrl")}/inventory-item.html`
    );
    cy.contains("button", "ADD TO CART").click();

    cy.get(".shopping_cart_badge").should("have.text", "1");
    cy.contains("button", "REMOVE").should("be.visible");

    cy.get(".inventory_details_back_button").click({ force: true });
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get(".shopping_cart_badge").should("have.text", "1");
    cy.get(".btn_inventory").first().should("have.text", "REMOVE");
  });

  it("clica no produto e remove do carrinho", () => {
    cy.get(".inventory_item_name").first().click();
    cy.url().should(
      "include",
      `${Cypress.config("baseUrl")}/inventory-item.html`
    );
    cy.contains("button", "ADD TO CART").click();

    cy.get(".shopping_cart_badge").should("have.text", "1");
    cy.contains("button", "REMOVE").should("be.visible");

    cy.contains("button", "REMOVE").click();
    cy.get(".shopping_cart_badge").should("not.exist");

    cy.get(".inventory_details_back_button").click({ force: true });
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get(".shopping_cart_badge").should("not.exist");
    cy.get(".btn_inventory").first().should("have.text", "ADD TO CART");
  });

  it("verifica botão 'Continue Shopping'", () => {
    const quantity = 3;
    cy.addItemToCart(quantity);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.contains("a", "Continue Shopping").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get("span.shopping_cart_badge").should("have.text", quantity.toString());
  });

  it("verifica obrigatoriedade dos campos no formulário do checkout", () => {
    cy.addItemToCart(1);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.get("a.checkout_button").click();

    // Verifica com nenhum campo preenchido
    cy.verifyCheckoutError();

    // Verifica com apenas o First Name preenchido
    cy.get("input#first-name").type("Otávio", { delay: 0 });
    cy.verifyCheckoutError();
    cy.get("input#first-name").clear();

    // Verifica com apenas Last Name preenchido
    cy.get("input#last-name").type("Queiroz", { delay: 0 });
    cy.verifyCheckoutError();
    cy.get("input#last-name").clear();

    // Verifica com apenas Postal Code preenchido
    cy.get("input#postal-code").type("38320000", { delay: 0 });
    cy.verifyCheckoutError();
  });

  it("cancela compra no formulário do checkout", () => {
    const quantity = 2;
    cy.addItemToCart(quantity);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.get("a.checkout_button").click();

    cy.get("input#first-name").type("Otávio", { delay: 0 });
    cy.get("input#last-name").type("Queiroz", { delay: 0 });
    cy.get("input#postal-code").type("38320000", { delay: 0 });

    cy.get(".cart_cancel_link").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/cart.html`);
    cy.get("span.shopping_cart_badge").should("have.text", quantity.toString());
    cy.get(".cart_item").should("have.length", quantity);
  });

  it("cancela compra no checkout", () => {
    const quantity = 2;
    cy.addItemToCart(quantity);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.get("a.checkout_button").click();

    cy.get("input#first-name").type("Otávio", { delay: 0 });
    cy.get("input#last-name").type("Queiroz", { delay: 0 });
    cy.get("input#postal-code").type("38320000", { delay: 0 });
    cy.get("input[type='submit']").click();

    cy.get(".cart_cancel_link").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get("span.shopping_cart_badge").should("have.text", quantity.toString());
  });

  it("verifica fluxo de compra completo", () => {
    const quantity = 3;
    cy.addItemToCart(quantity);

    // Acessando a tela de checkout
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.get("a.checkout_button").click();
    cy.url().should(
      "eq",
      `${Cypress.config("baseUrl")}/checkout-step-one.html`
    );

    // Preenchendo o formulário de checkout e clicando em "Continue"
    cy.get("input#first-name").type("Otávio", { delay: 0 });
    cy.get("input#last-name").type("Queiroz", { delay: 0 });
    cy.get("input#postal-code").type("38320000", { delay: 0 });
    cy.get("input[type='submit']").click();
    cy.url().should(
      "eq",
      `${Cypress.config("baseUrl")}/checkout-step-two.html`
    );

    // Verificando se de fato há 1 itens no carrinho
    cy.get("span.shopping_cart_badge").should("have.text", quantity.toString());
    cy.get(".cart_item").should("have.length", quantity);

    // Pegando o valor de todos os itens, e armazenando no vetor "itemsPriceTotal"
    cy.get(".inventory_item_price").then((itemPrice) => {
      let itemsPriceTotal = [...itemPrice].map((item) =>
        parseFloat(item.innerText.substring(1))
      ); // Removo o "$" do valor retornado, deixando apenas o valor
      let expectedItemTotal = itemsPriceTotal.reduce(function (soma, i) {
        return soma + i;
      });

      cy.get(".summary_subtotal_label")
        .invoke("text")
        .then((itemTotal) => {
          const realItemTotal = parseFloat(itemTotal.substring(13)); // Pego somente o valor do "Item total"
          expect(realItemTotal).to.eq(expectedItemTotal);
        });

      let tax, total;
      cy.get(".summary_tax_label")
        .invoke("text")
        .then((itemTax) => {
          tax = parseFloat(itemTax.substring(6));
        })
        .get(".summary_total_label")
        .invoke("text")
        .then((itemTotal) => {
          total = parseFloat(itemTotal.substring(8));
        })
        .then(() => {
          const totalCheckout = expectedItemTotal + tax;
          expect(total).to.eq(totalCheckout);

          cy.contains("a", "FINISH").click();
          cy.url().should(
            "eq",
            `${Cypress.config("baseUrl")}/checkout-complete.html`
          );
          cy.get(".complete-header").should(
            "have.text",
            "THANK YOU FOR YOUR ORDER"
          );
        });
    });
  });
});
