describe("Testes E2E SauceDemo - Validação Página de Produtos", () => {
  beforeEach(() => {
    cy.login();
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
});
