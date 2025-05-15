describe("Task Manager E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/"); // Adjust the URL to your app's entry point
    cy.contains("Task Manager ng MAMAMO").should("be.visible");
  });

  describe("Task Creation", () => {
    it("should create a new basic task", () => {
      cy.contains("button", "Add New Task").click();
      cy.get('input[type="text"][id="title"]').type('Basic Task Test');
      cy.get('textarea#description').type('This is a description for my task');
      cy.contains('button[type="submit"]', 'Add Task').click();

      // Verify the task is created and displayed
      cy.contains('Basic Task Test').should('be.visible');
    });

    it("should create a new timed task", () => {
      cy.contains("button", "Add New Task").click();
      cy.contains('span', 'Timed').click();
      cy.get('input[type="text"][id="title"]').type('Timed Task Test');
      cy.get('textarea#description').type('This is a description for my timed task');
      cy.get('input[id="dueDate"][type="datetime-local"]').type('2025-08-30T12:00');
      cy.contains('button[type="submit"]', 'Add Task').click();

      // Verify the task is created and displayed
      cy.contains('Timed Task Test').should('be.visible');
    });

    it("should create a new checklist task", () => {
      cy.contains("button", "Add New Task").click();
      cy.contains('span', 'Checklist').click();
      cy.get('input[type="text"][id="title"]').type('Checklist Task Test');
      cy.get('textarea#description').type('This is a description for my checklist task');
      cy.get('input[type="text"][placeholder="New item"]').type('First item');
      cy.get('button[type="button"]').contains('Add').click();
      cy.get('input[type="text"][placeholder="New item"]').type('Second item');
      cy.get('button[type="button"]').contains('Add').click();
      cy.contains('button[type="submit"]', 'Add Task').click();

      // Verify the task is created and displayed
      cy.contains('Checklist Task Test').should('be.visible');
      cy.contains('First item').should('be.visible');
      cy.contains('Second item').should('be.visible');
    });
  });

  describe("Task Actions", () => {
        it("should mark a task as complete and then incomplete", () => {
      const taskTitle = "Basic Task Test";
    
      // Wait for the task to be fully loaded
      cy.wait(1000);
    
      // Find the task card
      cy.get('[data-testid*="task-card"]')
        .contains(taskTitle)
        .closest('[data-testid*="task-card"]')
        .as('taskCard');
    
      // Mark the task as complete
      cy.get('@taskCard')
        .find('button')
        .contains('Mark Complete')
        .click();
      
      // Verify it shows as completed
      cy.get('@taskCard')
        .find('button')
        .contains('Completed')
        .should('be.visible');
      
      // Mark it as incomplete again
      cy.get('@taskCard')
        .find('button')
        .contains('Completed')
        .click();
      
      // Verify it's back to incomplete
      cy.get('@taskCard')
        .find('button')
        .contains('Mark Complete')
        .should('be.visible');
    });

    it("should delete a task", () => {
      const taskTitle = "Basic Task Test";
    
      // Wait for the task to be fully loaded
      cy.wait(1000);
    
      // Find the task card
      cy.get('[data-testid*="task-card"]')
        .contains(taskTitle)
        .closest('[data-testid*="task-card"]')
        .as('taskCard');
    
      // Click the Delete button directly
      cy.get('@taskCard')
        .find('button')
        .contains('Delete')
        .click();
      
      // Verify task was deleted
      cy.contains(taskTitle).should('not.exist');
    });


    it("should filter tasks using search", () => {
      const searchQuery = "Timed";

      // Type in the search field
      cy.get('input[placeholder*="Search"]').type(searchQuery);

      // Ensure all shown tasks match the query
      cy.get('[data-testid*="task-card"]').each(($el) => {
        cy.wrap($el).should("contain.text", searchQuery);
      });
    });

    it("should sort tasks alphabetically", () => {
      // Change sort to name
      cy.get('select').select('Name');
      
      // Wait for sorting to take effect
      cy.wait(500);

      // Get titles and verify they're sorted
      cy.get('[data-testid*="task-card"]').then(($cards) => {
        const titles = Cypress._.map($cards, (card) => 
          Cypress.$(card).text().match(/^[^Delete]*/)[0].trim()
        );
        const sorted = [...titles].sort();
        expect(titles).to.deep.equal(sorted);
      });
    });
  });
});
