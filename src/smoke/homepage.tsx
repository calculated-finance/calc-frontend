describe('An example', () => {
  it('Should load', () => {
    cy.visit(`https://app.calculated.fi/?chain=Osmosis`);
    cy.get('h1').should('contain', 'Hi!');
    // Let's also confirm that we are on the right URL.
    cy.url().should('include', 'chain=Osmosis');

    // Now, let's find an entry on our navbar,
    // and let's click on it.
    cy.get('div.main-navbar').contains('Section 1').click();
    // Here too, we don't need to write code to
    // wait for our application to be
    // ready: Cypress will take care of it.
    cy.get('div.main-page>h2').should('contain', 'It works!');
  });
});
