/// <reference types="cypress" />
describe('wishlist functional tests', () => {
  const getUniqueTitle = () =>
    `A title at ${new Date().getSeconds()}${new Date().getMilliseconds()}`;

  const ListPage = {
    titleInput: () => cy.get('[data-testid="txtCardTitle"]'),
    addButton: () => cy.get('[data-testid="btnAddCard"]'),
    cardList: () => cy.get('[data-testid="cardList"]'),
    cardListItems: () => ListPage.cardList().children(),
    visit: () => cy.visit('http://localhost:8080'),
    clear: () => cy.clearLocalStorage(),
    createCard: (title: string) => {
      ListPage.titleInput().type(title);
      ListPage.addButton().click();
      return title;
    },
    firstCard: () => ListPage.cardListItems().first(),
    toggleCompletedFirstCard: () => cy.get('[data-testid="cardItem"]').click(),
    firstRemoveButton: () => cy.get('[data-testid="btnDeleteCard"]'),
  };

  beforeEach(() => {
    ListPage.visit();
  });
  afterEach(() => {
    ListPage.clear();
  });

  it('page loads properly', () => {
    // act
    ListPage.visit();
  });

  it('creates a new card', () => {
    // act
    const createdTitle = ListPage.createCard(getUniqueTitle());

    // assert
    ListPage.cardList().should('have.length', 1);
    ListPage.cardList().contains(createdTitle);
  });

  it('input field empties after card is submitted', () => {
    // act
    ListPage.createCard(getUniqueTitle());

    // assert
    ListPage.titleInput().should('have.value', '');
  });

  it('creates a few new cards', () => {
    // act
    ListPage.createCard(getUniqueTitle());
    ListPage.createCard(getUniqueTitle());
    ListPage.createCard(getUniqueTitle());

    // assert
    ListPage.cardListItems().should('have.length', 3);
  });

  it('completes a card', () => {
    // arrange
    ListPage.createCard(getUniqueTitle());

    // act
    ListPage.firstCard().should('not.have.class', 'list__item--completed');

    ListPage.toggleCompletedFirstCard();
    ListPage.firstCard().should('have.class', 'list__item--completed');
  });

  it('uncompletes a card', () => {
    // arrange
    ListPage.createCard(getUniqueTitle());

    // act
    ListPage.toggleCompletedFirstCard();
    ListPage.toggleCompletedFirstCard();
    ListPage.firstCard().should('not.have.class', 'list__item--completed');
  });

  it('completed items has remove button', () => {
    // arrange
    ListPage.createCard(getUniqueTitle());

    ListPage.firstRemoveButton().should('not.exist');
    ListPage.toggleCompletedFirstCard();
    ListPage.firstRemoveButton().should('exist');
  });

  it('remove card removes the card from the list', () => {
    // arrange
    ListPage.createCard(getUniqueTitle());

    ListPage.cardListItems().should('have.length', 1);

    ListPage.toggleCompletedFirstCard();
    ListPage.firstRemoveButton().click();
    ListPage.cardListItems().should('have.length', 0);
  });

  it('removes the correct card', () => {
    // arrange
    ListPage.createCard(getUniqueTitle());
    const titleToRemove = ListPage.createCard('The one we want to remove');
    ListPage.createCard(getUniqueTitle());

    const el = ListPage.cardListItems().contains(titleToRemove);
    el.click();
    el.get('[data-testid="btnDeleteCard"]').click();
  });
});
