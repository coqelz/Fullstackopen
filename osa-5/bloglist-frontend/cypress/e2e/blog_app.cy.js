describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const userRoot = {
      name: 'root',
      username: 'root',
      password: 'root'
    }
    const userJuho = {
      name: 'Juho',
      username: 'juhokokko',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', userRoot)
    cy.request('POST', 'http://localhost:3003/api/users/', userJuho)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('root')
      cy.get('#log-in-button').click()
      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('noUser')
      cy.get('#password').type('noPass')
      cy.get('#log-in-button').click()
      cy.get('.error').should('contain', 'wrong credentials')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password:'root' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
        .get('#title').type('How to cypress')
        .get('#author').type('cypress')
        .get('#url').type('https://cypress.com')
        .get('#create-button').click()
      cy.contains('How to cypress')
    })
    describe('and a blog exists', function () {
      beforeEach(function() {
        cy.create({ title: 'Cypress create', author: 'Cypress', url: 'https://cypress.com' })
      })

      it('a blog can be liked', function () {
        cy.contains('view').click()
        cy.contains('0')
        cy.contains('like').click()
        cy.contains('1')
      })

      it('a blog can be removed by its adder', function () {
        cy.contains('view').click()
        cy.get('#remove').click()
        cy.get('.message').should('contain', 'Removed blog Cypress create by Cypress')
      })

      it('only the blogs adder can see remove', function () {
        cy.contains('logout').click()
        cy.login({ username: 'juhokokko', password: 'password' })
        cy.contains('view').click()
        cy.get('#remove').should('not.exist')
      })
    })

    describe('and a few blogs exist', function () {
      beforeEach(function () {
        cy.create({ title: 'first', author: 'cypress', url:'url' })
        cy.create({ title: 'second', author: 'cypress', url:'url' })
      })

      it('blogs are ordered by likes', function () {
        cy.contains('first')
          .contains('view')
          .click()
          .parent()
          .contains('like')
          .click()
        cy.contains('second')
          .contains('view')
          .click()
          .parent()
          .contains('like')
          .click()
          .click()
        cy.get('.blog').eq(0).should('contain', 'second')
        cy.get('.blog').eq(1).should('contain', 'first')
      })
    })

  })

})