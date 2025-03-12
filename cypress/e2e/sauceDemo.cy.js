const setLimits = (limit, addQuantity, removeQuantity) => {
  if (addQuantity > limit) addQuantity = limit;
  if (addQuantity > limit) removeQuantity = limit;
  if (removeQuantity > addQuantity) removeQuantity = addQuantity;

  return { addQuantity, removeQuantity };
};

describe("Testes E2E - SauceDemo", () => {
  beforeEach(() => {
    cy.login();
  });

  // it("verifica falha ao logar com campos em branco", () => {
  //   cy.visit(`${Cypress.config("baseUrl")}/index.html`);

  //   // Ambos os campos em branco
  //   cy.get("input[type='submit']").click();
  //   cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
  //   cy.get("h3[data-test='error']")
  //     .should("be.visible")
  //     .and("contain", "Username is required");

  //   // Usuário em branco
  //   cy.get("input[name='password']").type(Cypress.env("user_password"), {
  //     log: false,
  //   });
  //   cy.get("input[type='submit']").click();
  //   cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
  //   cy.get("h3[data-test='error']")
  //     .should("be.visible")
  //     .and("contain", "Username is required");

  //   // Senha em branco
  //   cy.get("input[name='password']").clear();
  //   cy.get("input[name='user-name']").type(Cypress.env("user_name"));
  //   cy.get("input[type='submit']").click();
  //   cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
  //   cy.get("h3[data-test='error']")
  //     .should("be.visible")
  //     .and("contain", "Password is required");
  // });

  // it("verifica falha ao logar com user inválido", () => {
  //   cy.visit(`${Cypress.config("baseUrl")}/index.html`);

  //   cy.get("input[name='user-name']").type("user");
  //   cy.get("input[name='password']").type(Cypress.env("user_password"), {
  //     log: false,
  //   });
  //   cy.get("input[type='submit']").click();

  //   cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
  //   cy.get("h3[data-test='error']").should("be.visible");
  // });

  // it("verifica falha ao logar com senha inválida", () => {
  //   cy.visit(`${Cypress.config("baseUrl")}/index.html`);

  //   cy.get("input[name='user-name']").type(Cypress.env("user_name"));
  //   cy.get("input[name='password']").type("senha", {
  //     log: false,
  //   });
  //   cy.get("input[type='submit']").click();

  //   cy.url().should("eq", `${Cypress.config("baseUrl")}/index.html`);
  //   cy.get("h3[data-test='error']").should("be.visible");
  // });

  it("verifica sucesso ao logar", () => {
    // Assert - Verificação (Garante o resultado esperado)
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.contains("Products").should("be.visible");
  });

  it("verifica quantidade de produtos exibidos", () => {
    cy.get("div[class='inventory_item']").should("have.length", 6);
  });

  it("verifica ordenação pelo nome", () => {
    cy.get(".inventory_item_name").then((itemName) => {
      let itemsNames = [...itemName].map((item) => item.innerText);

      const sortedAscItemsNames = [...itemsNames].sort((a, b) =>
        a.localeCompare(b)
      );
      const sortedDescItemsNames = [...sortedAscItemsNames].reverse();

      expect(itemsNames).to.deep.equal(sortedAscItemsNames); // Verifica ordenação crescente baseado no nome

      cy.get(".product_sort_container")
        .select("Name (Z to A)")
        .then(() => {
          cy.get(".inventory_item_name").then((itemsReversed) => {
            let itemsNamesReversed = [...itemsReversed].map(
              (itemReversed) => itemReversed.innerText
            );
            expect(itemsNamesReversed).to.deep.equal(sortedDescItemsNames); // Verifica ordenação decrescente baseado no nome
          });
        });
    });
  });

  it("verifica ordenação pelo preço", () => {
    cy.get(".product_sort_container")
      .select("Price (low to high)")
      .then(() => {
        cy.get(".inventory_item_price").then((itemPrice) => {
          let itemsPrice = [...itemPrice].map((item) =>
            parseFloat(item.innerText.substring(1))
          );

          const sortedAscItemsPrice = [...itemsPrice].sort((a, b) => a - b);
          const sortedDescItemsPrice = [...sortedAscItemsPrice].reverse();

          expect(itemsPrice).to.deep.equal(sortedAscItemsPrice); // Verifica ordenação crescente baseado no preço

          cy.get(".product_sort_container")
            .select("Price (high to low)")
            .then(() => {
              cy.get(".inventory_item_price").then((itemsReversed) => {
                let itemsPriceReversed = [...itemsReversed].map(
                  (itemReversed) =>
                    parseFloat(itemReversed.innerText.substring(1))
                );
                expect(itemsPriceReversed).to.deep.equal(sortedDescItemsPrice); // Verifica ordenação decrescente baseado no preço
              });
            });
        });
      });
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

  it("verifica botão 'Continue Shopping'", () => {
    const quantity = 3;
    cy.addItemToCart(quantity);
    cy.get("svg[data-icon='shopping-cart']").click();
    cy.contains("a", "Continue Shopping").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
    cy.get("span.shopping_cart_badge").should("have.text", quantity.toString());
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

  it("visualiza 'All items' no menu lateral", () => {
    cy.get(".bm-burger-button").click();
    cy.contains("a", "All Items").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/inventory.html`);
  });

  it("visualiza 'About' no menu lateral", () => {
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
