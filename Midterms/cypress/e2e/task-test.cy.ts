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

    it.only("should create a new checklist task", () => {
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
});