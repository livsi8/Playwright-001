# Playwright + TypeScript Autotest Framework

Единый TypeScript-only framework для UI и API автотестов на базе Playwright Test. Проект ориентирован на multi-brand конфигурацию, worker-safe account allocation, fluent-style API слой, логирование, запуск по tag expression и читаемые steps без добавления Java, Cucumber или Rest Assured.

## Почему только TypeScript

- Один язык для UI, API, runner scripts и shared utilities.
- Playwright уже даёт зрелую test runner экосистему для браузера и API.
- Fluent API слой реализован поверх TypeScript и `APIRequestContext`, без Java зависимостей и без концептуального разрыва между UI/API тестами.

## Структура проекта

```text
.
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── .env.example
├── src
│   ├── api
│   │   ├── assertions
│   │   ├── clients
│   │   ├── models
│   │   ├── services
│   │   └── steps
│   ├── config
│   │   └── brands
│   ├── core
│   │   ├── fixtures
│   │   └── runner.ts
│   ├── shared
│   │   ├── account-manager
│   │   ├── logger
│   │   ├── soft-assert
│   │   ├── tag-utils
│   │   └── utils
│   └── ui
│       ├── assertions
│       ├── components
│       ├── pages
│       └── steps
└── tests
    ├── api
    └── ui
```

## Архитектурные решения

- `src/config`: типизированные brand configs. Сейчас добавлен `demoqa`.
- `src/core/fixtures/test-fixtures.ts`: единая точка worker fixtures и test fixtures для UI/API.
- `src/shared/tag-utils`: parser и evaluator для выражений вида `@ui and (@c123 or @c124) and not @api`.
- `src/shared/account-manager`: детерминированное выделение уникального аккаунта на worker.
- `src/api`: fluent-style API layer в стиле Rest Assured, но на TypeScript.
- `src/ui`: Page Object Model + component objects + steps layer.

## Установка

```bash
npm install
npx playwright install chromium
```

Для генерации Allure report проект использует локальную npm-зависимость `allure-commandline`. Для запуска Allure CLI на машине должен быть установлен Java.

## Запуск из консоли

UI:

```bash
npm run test:ui -- --brand=demoqa --workers=4 --tags="@ui and @smoke"
```

API:

```bash
npm run test:api -- --brand=demoqa --workers=4 --tags="@api and (@c123 or @c124)"
```

Все тесты:

```bash
npm run test:all -- --brand=demoqa --workers=4 --tags="(@ui or @api) and not @wip"
```

Только фильтрация по тегам:

```bash
npm run test:tags -- --brand=demoqa --workers=2 --tags="@regression and not @wip"
```

Новые UI сценарии для `alertsWindows`:

```bash
npm run test:ui -- --brand=demoqa --workers=4 --tags="@alertsWindows and @ui"
```

## Как работают параметры

- `--brand`: выбирает brand config через `src/config/brand-registry.ts`.
- `--workers`: передаётся в Playwright CLI и реально управляет параллельностью воркеров.
- `--tags`: сохраняется в `TAG_EXPRESSION` и применяется через кастомный parser/evaluator в `src/shared/tag-utils/tag-expression.ts`.
- `--type`: используется внутренним runner script `src/core/runner.ts` и определяет набор Playwright projects: `ui`, `api`, `all`.

## Tag expression

Поддерживаются:

- `and`
- `or`
- `not`
- скобки
- теги вида `@ui`, `@api`, `@smoke`, `@c123`

Пример:

```text
@ui and (@c123 or @c124) and not @api
```

Неформально это означает:

- тест обязан иметь `@ui`
- тест обязан иметь `@c123` или `@c124`
- тест не должен иметь `@api`

Фильтрация реализована на этапе объявления теста через `createTaggedTest(...)`, поэтому не подходящие сценарии помечаются как `skip` ещё до выполнения тела теста.

## Бренды и аккаунты

Brand config расположен в `src/config/brands/demoqa.ts`.

Он содержит:

- brand name
- environment name
- base UI URL
- base API URL
- timeouts
- browser config
- список аккаунтов

Пример аккаунтов хранится типизированно через `BrandAccount[]`, а не как набор разрозненных строк.

### Как добавить новый бренд

1. Создать файл по аналогии с `src/config/brands/demoqa.ts`.
2. Заполнить `BrandConfig`.
3. Зарегистрировать бренд в `src/config/brand-registry.ts`.
4. Передавать новый ключ через `--brand=<newBrand>`.

### Как добавить новые аккаунты

Отредактировать массив `accounts` в brand config:

```ts
accounts: [
  {
    id: 'brand-user-04',
    email: 'user-04@xz.com',
    password: 'Password55',
    displayName: 'Brand User 04'
  }
]
```

## Потокобезопасность

- Уникальный аккаунт выделяется на worker через worker-scoped fixture `account`.
- Аллокация выполняется детерминированно: `workerIndex -> accounts[workerIndex]`.
- Общий mutable singleton для пользователей не используется.
- Каждый тест получает собственный `page`, `browser context` и `APIRequestContext`.
- Конфиг бренда создаётся как immutable value для worker.

Это исключает ситуацию, когда два параллельных worker используют один и тот же аккаунт, при условии что число аккаунтов не меньше числа workers.

## Где что реализовано

- Brand configs: `src/config/brands/*`
- Multi-threading: Playwright workers + `src/core/runner.ts`
- Unique accounts per worker: `src/shared/account-manager/account-manager.ts`, `src/core/fixtures/test-fixtures.ts`
- Tag filtering: `src/shared/tag-utils/tag-expression.ts`, `src/shared/tag-utils/tagged-test.ts`
- Soft assert: `src/shared/soft-assert/soft-assert.ts`
- Steps-like layer: `src/ui/steps/home.steps.ts`, `src/api/steps/book-store.steps.ts`
- Feature-like UI steps для alerts/windows: `src/ui/steps/browser-windows.steps.ts`, `src/ui/steps/alerts.steps.ts`, `src/ui/steps/frames.steps.ts`, `src/ui/steps/modal-dialogs.steps.ts`, `src/ui/steps/css-verification.steps.ts`
- Stream API equivalents: `tests/api/bookstore.spec.ts`
- Logging: `src/shared/logger/logger.ts`
- Page objects / component objects: `src/ui/pages/*`, `src/ui/components/*`
- Fluent API layer: `src/api/clients/*`, `src/api/services/*`, `src/api/assertions/*`

## UI слой

- Все селекторы находятся только внутри page/component objects.
- `HomePage`, `SectionPage`, `PracticeFormPage` инкапсулируют действия и элементы.
- `CategoryCardComponent`, `HeaderComponent`, `SideMenuComponent` отвечают за отдельные UI блоки.
- `HomeSteps` делает сценарии читаемыми как последовательность бизнес-шагов.
- Для `alertsWindows` добавлены отдельные step classes по страницам, чтобы tests читались как сценарии Given / When / Then, а повторяющиеся действия и CSS-проверки не дублировались.

## Allure Report

После запуска тестов результаты сохраняются в `allure-results`.

Очистить старые результаты:

```bash
npm run allure:clean
```

Сгенерировать отчёт:

```bash
npm run allure:generate
```

Открыть отчёт в браузере:

```bash
npm run allure:open
```

Типовая последовательность:

```bash
npm run test:ui -- --brand=demoqa --workers=4 --tags="@alertsWindows and @ui"
npm run allure:generate
npm run allure:open
```

Проверить Java:

```bash
java -version
```

## API слой

- `ApiClient` создаёт chainable `RequestBuilder`.
- `RequestBuilder` позволяет строить request fluent-style: method, path, query, body, headers.
- `ResponseWrapper` инкапсулирует status/json/raw response.
- `BookStoreService` отвечает за API endpoints.
- `BookStoreApiSteps` делает API сценарии читаемыми и логически отделёнными от тестов.

Для стабильности использованы публичные BookStore GET endpoints Demo QA. Это уменьшает флаки по сравнению с POST сценариями, зависящими от состояния тестовых пользователей на публичном стенде.

## IntelliJ IDEA

Проект готов к запуску из IntelliJ IDEA:

- открыть корень репозитория как Node.js / TypeScript проект
- выполнить `npm install`
- запускать `npm run test:ui`, `npm run test:api`, `npm run test:all`
- при необходимости передавать аргументы после `--`

## Проверка после генерации

После создания проекта нужно выполнить:

```bash
npm install
npx playwright install chromium
npm run typecheck
npm run test:ui -- --brand=demoqa --workers=4 --tags="@ui"
npm run test:api -- --brand=demoqa --workers=4 --tags="@api"
npm run allure:generate
```

Именно эти команды я запускаю после генерации проекта, чтобы убедиться, что framework стартует и тесты проходят.
