
context('Order', () => {

  it('Coffee', () => {

    // Login
    cy.visit("https://extractcoffee.co.uk/my-account/")
    cy.get('.login')
      .find('[name="username"]')
      .type(Cypress.env('username'))
    cy.get('.login')
      .find('[name="password"]')
      .type(Cypress.env('password'))
    cy.get('.login').find('[type="submit"]').click()

    // Go to the cast iron product
    cy.visit(Cypress.env('productPage'))
    // Ensure whole-bean
    cy.get('.variations').find(`[data-value="${Cypress.env('grindType')}"]`).click()
    // Add to basket
    cy.get('.single_add_to_cart_button').click()

    // Check the amount is as expected
    cy.get('.woocommerce-Price-amount').contains(Cypress.env('expectedOrderTotal'))

    // Go to the checkout - Assume nearly all the defaults are correct
    cy.visit('https://extractcoffee.co.uk/checkout/').wait(2000)
    // Check terms box
    cy.get("form").find('input[name="terms"]').check()

    // These final 2 steps may need to be skipped if we don't want to order
    // when testing.
    if(!Cypress.env('dryRun')){
        // Pay
        cy.get("#place_order").click()

        // Assert we see the complete page
        // The site seems really slow
        cy.get("h1").contains("Thank You for your Order", {timeout: 25000})
    }
  })
})
