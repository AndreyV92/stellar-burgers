// Общие константы по именам ингредиентов
const SELECTOR_BUN = 'Краторная булка N-200i';
const SELECTOR_MAIN_1 = 'Биокотлета из марсианской Магнолии';
const SELECTOR_MAIN_2 = 'Филе Люминесцентного тетраодонтимформа';

// Хелпер: заходим на главную и подменяем /ingredients фикстурой
const visitWithIngredients = () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );

  cy.visit('/');           // baseUrl берётся из cypress.config.{ts,js}

  cy.wait('@getIngredients');
};

/* ------------------------------------------------------------------ */
/*  BurgerIngredientUI                                                */
/* ------------------------------------------------------------------ */

describe('BurgerIngredientUI component', () => {
  beforeEach(() => {
    visitWithIngredients();
  });

  it('открывает модалку при клике на ингредиент', () => {
    cy.contains(SELECTOR_BUN).click();
    cy.contains('Детали ингредиента').should('exist');
  });
});

/* ------------------------------------------------------------------ */
/*  BurgerConstructorUI                                               */
/* ------------------------------------------------------------------ */

describe('BurgerConstructorUI component', () => {
  beforeEach(() => {
    visitWithIngredients();
  });

  it('добавляет ингредиенты и показывает их в конструкторе', () => {
    cy.contains(SELECTOR_BUN).parent().contains('Добавить').click();
    cy.contains(SELECTOR_MAIN_1).parent().contains('Добавить').click();

    // тут селекторы подставь под свои (data-testid очень удобны)
    cy.get('[data-testid="constructor-bun"]').should('contain', SELECTOR_BUN);
    cy.get('[data-testid="constructor-fillings"]').should(
      'contain',
      SELECTOR_MAIN_1
    );
  });
});

/* ------------------------------------------------------------------ */
/*  IngredientDetails (по роуту /ingredients/:id)                     */
/* ------------------------------------------------------------------ */

describe('IngredientDetails route component', () => {
  it('открывает компонент с данными ингредиента по прямой ссылке', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/ingredients/643d69a5c3f7b9001cfa093d');
    cy.wait('@getIngredients');

    cy.contains('Детали ингредиента').should('exist');
  });
});

/* ------------------------------------------------------------------ */
/*  Modal                                                             */
/* ------------------------------------------------------------------ */

describe('Modal component', () => {
  beforeEach(() => {
    visitWithIngredients();
  });

  it('появляется и закрывается по Esc', () => {
    cy.contains(SELECTOR_BUN).click();
    cy.contains('Детали ингредиента').should('exist');

    // закрываем модалку клавишей Escape
    cy.get('body').type('{esc}');

    cy.contains('Детали ингредиента').should('not.exist');
  });
});

/* ------------------------------------------------------------------ */
/*  AppHeader                                                         */
/* ------------------------------------------------------------------ */

describe('AppHeader component', () => {
  it('содержит ссылку на "Конструктор"', () => {
    visitWithIngredients();
    cy.contains('Конструктор').should('have.attr', 'href');
  });
});

/* ------------------------------------------------------------------ */
/*  Order flow                                                        */
/* ------------------------------------------------------------------ */

describe('Order flow', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'Bearer test-token');

    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/', {
      onBeforeLoad(win) {
        const originalFetch = win.fetch; // сохраним оригинальный fetch

        cy.stub(win, 'fetch').callsFake((url: RequestInfo | URL, options) => {
          const urlStr = url.toString();

          // перехватываем создание заказа
          if (urlStr.includes('/orders')) {
            return Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  order: { number: 123456 }
                })
            } as Response);
          }

          // все остальные запросы идут как обычно
          return originalFetch(url, options);
        });
      }
    });

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

    // ожидаем, что откроется модалка с номером заказа
    cy.contains('123456').should('exist');
  });
});