# Testing

This application has the following test types set up:

- integration (via Vitest)
- end-to-end tests (via Playwright)
- client interaction testing (via Storybook and Chromatic)
- client visual regression testing (via Storybook and Chromatic)

This section will cover the "backend" tests (integration and e2e), as well as how to write new tests for tRPC procedures.
For more information on the client tests, refer to the [Storybook](./11-storybook.md) and [Chromatic](./12-chromatic.md) sections.

## Integration tests

The integration tests use [Vitest](https://vitest.dev/). The groundwork has been laid out to ensure that the tests are set up to run with the correct environment variables and database connection, and has also been verified to work with testing tRPC procedures.

:::info
"Why Vitest? Why not Jest?" you may ask. Basically because it is faster. Read Vitest's [comparison page](https://vitest.dev/guide/comparisons.html).
:::

### Related Vitest files

Everything has already been set up in the application. The main files to look at are:

| File               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `vitest.config.ts` | This is the Vitest configuration file.         |
| `.env.test`        | Environment variables specifically for testing |

### Running Vitest (locally)

As this is an integration test suite that relies on a working database connection (rather than mocking the database), you will need to spin up the database before running the tests. This can be done with:

```sh
npm run setup
```

to spin up the database in a Docker container.

Then, run the tests with: `npm run test-dev:unit` for watch mode or `npm run test:unit` for a single run.

The test scripts have been set up to use the `.env.test` file, which has been configured to use the test database connection (specifically the `test` database exposed `localhost:26257`).

### Setup and teardown of Prisma per test

<details>
<summary>Advanced: How tests run Prisma queries in parallel</summary>

The application uses a Vitest helper package [`vitest-environment-vprisma`](https://github.com/aiji42/vitest-environment-vprisma), which improves the experience of testing with `vitest` and `@prisma/client`. It allows you to isolate each test case with a transaction and rollback after completion, giving you a safe and clean testing environment.

A Prisma mock has been set up in the application that converts all Prisma Client usage in tests to use the mock. This is done in `vitest.setup.ts`:

```ts title="vitest.setup.ts"
import { vi } from "vitest";

vi.mock("./src/server/prisma", () => ({
  prisma: vPrisma.client,
}));
```

You can then use the `prisma` object in your tests as you would normally.

```ts title="src/server/modules/auth/email/__tests__/email.router.test.ts"
import { prisma } from "~/server/prisma";
// ...
await prisma.verificationToken.create({
  data: {
    expires: new Date(Date.now() + env.OTP_EXPIRY * 1000),
    identifier: TEST_EMAIL,
    token: VALID_TOKEN_HASH,
  },
});
```

</details>

### Writing new integration tests for tRPC procedures

You can easily set the tRPC context using the `createContextInner` function exposed in `src/server/context.ts`.
The application also includes helper functions that you can use to set up the context for your tests in `tests/integration/helpers/iron-session.ts`,

| Function name        | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `applySession`       | Create a mock `IronSession` object that you can use to set up an **unauthenticated** session. |
| `applyAuthedSession` | Create a mock `IronSession` object that you can use to set up an **authenticated** session.   |

Which can be used as follows:

```ts
import { createContextInner } from "~/server/context";
import {
  applyAuthedSession,
  applySession,
} from "tests/integration/helpers/iron-session";

// Unauthorized session example
describe("auth.email router", () => {
  describe("login procedure", () => {
    it("should throw if email is not provided", async () => {
      // Arrange
      const session = applySession();
      const ctx = await createContextInner({ session });
      const caller = emailSessionRouter.createCaller(ctx);

      // Act
      // Call procedure with empty email
      const result = caller.login({ email: "" });

      // Assert
      await expect(result).rejects.toThrowError();
    });
  });
});

// Authorized session example
describe("post router", () => {
  describe("add procedure", () => {
    it("post should be retrievable after creation", async () => {
      const defaultUser: User = {
        /* ... */
      };
      const session = await applyAuthedSession(defaultUser);
      const ctx = await createContextInner({
        session,
      });
      const caller = postRouter.createCaller(ctx);

      const input: RouterInput["post"]["add"] = {
        title: "hello test",
        content: "hello test with a long input",
        contentHtml: "<p>hello test with a long input</p>",
      };

      const post = await postRouter.add(input);
      const byId = await postRouter.byId({ id: post.id });

      expect(byId).toMatchObject(input);
    });
  });
});
```

## End-to-end (E2E) tests

E2E tests uses Playwright. Tests are located in the `playwright` folder.

### Running Playwright (locally)

As this is an e2e test suite, both the application and database needs to be active. This can be done with:

```sh
npm run setup
npm run dev
```

to spin up the database in a Docker container, as well as run the Next.js application.

Then, run the e2e tests with: `nm run test:e2e`, which will spin up the Playwright test runner.

The test script has been set up to use the `.env.test` file, which has been configured to use the test database connection (specifically the `test` database exposed `localhost:26257`).

### Writing new E2E tests

Playwright provides a `test` function to declare tests and `expect` function to write assertions, similar to Vitest (and other test runners).

In e2e tests, you can use the `page` object to interact with the browser. For example, to go to the home page and check that the app name is displayed:

```ts
import { test, expect } from "@playwright/test";
import { env } from "~/env.mjs";

test("go to /", async ({ page }) => {
  await page.goto("/");

  await page.waitForSelector(`text=${env.NEXT_PUBLIC_APP_NAME}`);
});
```

The runner also exposes the request and response objects after an action, which you can use to make assertions on the HTTP requests made by the application. For example, to check that the 404 page returns a 404 status code:

```ts
test("test 404", async ({ page }) => {
  const res = await page.goto("/not-found");
  expect(res?.status()).toBe(404);
});
```

### Related Playwright files

Everything has already been set up in the application. The main files to look at are:

| File                    | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `playwright.config.ts`  | This is the Playwright configuration file.     |
| `.env.test`             | Environment variables specifically for testing |
| `playwright/**.test.ts` | The E2E tests                                  |

## Useful Resources

| Resource                 | Link                                      |
| ------------------------ | ----------------------------------------- |
| Vitest config            | https://vitest.dev/config/                |
| Writing Playwright Tests | https://playwright.dev/docs/writing-tests |
