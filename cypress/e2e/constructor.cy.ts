const SELECTOR_BUN = 'Краторная булка N-200i';
const SELECTOR_MAIN_1 = 'Биокотлета из марсианской Магнолии';
const SELECTOR_MAIN_2 = 'Филе Люминесцентного тетраодонтимформа';

const visitWithIngredients = () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );

  cy.visit('/');

  cy.wait('@getIngredients');
};

afterEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
});

describe('BurgerIngredientUI component', () => {
  beforeEach(() => {
    visitWithIngredients();
  });

  it('открывает модалку и показывает данные ингредиента', () => {
    cy.contains(SELECTOR_BUN).click();

    cy.contains(SELECTOR_BUN).should('exist');
    cy.contains('Калории, ккал').should('exist');
    cy.contains('Белки, г').should('exist');
    cy.contains('Жиры, г').should('exist');
    cy.contains('Углеводы, г').should('exist');
  });
});

describe('BurgerConstructorUI component', () => {
  beforeEach(() => {
    visitWithIngredients();
  });

  it('добавляет ингредиенты и показывает их в конструкторе', () => {
    cy.contains(SELECTOR_BUN).parent().contains('Добавить').click();
    cy.contains(SELECTOR_MAIN_1).parent().contains('Добавить').click();

    cy.get('.constructor-element').contains(SELECTOR_BUN).should('exist');
    cy.get('.constructor-element').contains(SELECTOR_MAIN_1).should('exist');
  });
});

describe('IngredientDetails route component', () => {
  it('открывает компонент с данными ингредиента по прямой ссылке', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // id Краторной булки из fixtures/ingredients.json
    cy.visit('/ingredients/643d69a5c3f7b9001cfa093c');
    cy.wait('@getIngredients');

    cy.contains(SELECTOR_BUN).should('exist');
    cy.contains('Калории, ккал').should('exist');
    cy.contains('Белки, г').should('exist');
    cy.contains('Жиры, г').should('exist');
    cy.contains('Углеводы, г').should('exist');
  });
});

describe('Modal component', () => {
  beforeEach(() => {
    visitWithIngredients();
  });

  it('появляется и закрывается по Esc', () => {
    cy.contains(SELECTOR_BUN).click();

    cy.contains('Калории, ккал').should('exist');

    cy.get('body').type('{esc}');

    cy.contains('Калории, ккал').should('not.exist');
  });
});

describe('AppHeader component', () => {
  it('содержит ссылку на "Конструктор"', () => {
    visitWithIngredients();
    cy.contains('Конструктор').should('have.attr', 'href');
  });
});

describe('Order flow', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'Bearer test-token');
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'Bearer test-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

    // перехват создания заказа БЕЗ фикстуры, ответ зашит прямо в тест
    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Test',
        order: {
          number: 69289
        }
      }
    }).as('createOrder');

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  it('оформляет заказ', () => {
    cy.contains(SELECTOR_BUN).parent().contains('Добавить').click();
    cy.contains(SELECTOR_MAIN_1).parent().contains('Добавить').click();
    cy.contains(SELECTOR_MAIN_2).parent().contains('Добавить').click();

    cy.get('button')
      .contains('Оформить заказ')
      .should('not.be.disabled')
      .click();

    cy.wait('@createOrder');

    cy.contains('69289').should('exist');
  });
});