/// <reference types="cypress" />

describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('https://app.calculated.fi/?chain=osmosis-1');
  });

  it('displays the heading', () => {
    cy.get('h2').first().should('have.text', "Welcome to CALC, you've made a great choice!");
  });
});
