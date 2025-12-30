# Testing

This application has the following test types set up:

- Integration tests (via Vitest + Testcontainers)
- End-to-end tests (via Playwright + Testcontainers)
- Client interaction testing (via Storybook and Chromatic)
- Client visual regression testing (via Storybook and Chromatic)

This section will cover the integration tests, E2E tests, as well as how to write new tests for tRPC procedures.
For more information on the client tests, refer to the [Storybook](./11-storybook.md) and [Chromatic](../optional-features/01-chromatic.md) sections.

## Integration tests

The integration tests use [Vitest](https://vitest.dev/) with [Testcontainers](https://testcontainers.com/) for database isolation. Tests run against real PostgreSQL databases spun up in Docker containers, ensuring each test file gets a clean, isolated database instance.

:::info
"Why Vitest? Why not Jest?" you may ask. Basically because it is faster. Read Vitest's [comparison page](https://vitest.dev/guide/comparisons.html).
:::

### Related test files

Everything has already been set up in the application. The main files to look at are:

| File                             | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| `vitest.config.ts` (root)        | Root Vitest config that defines workspace projects                   |
| `apps/web/vitest.config.ts`      | Web app Vitest config with test environment setup                    |
| `apps/web/tests/global-setup.ts` | Global setup that starts Testcontainers (database, optionally Redis) |
| `apps/web/tests/db/setup.ts`     | Per-test database setup with Prisma migrations                       |
| `apps/web/tests/trpc.ts`         | tRPC testing utilities (context creation, caller factory)            |
| `apps/web/tests/common.ts`       | Container configuration and utilities                                |

### Running Vitest (locally)

The tests use Testcontainers to automatically spin up PostgreSQL containers, so you only need Docker running. No manual database setup required.

Run the tests with:

```sh
pnpm test
```

Test environment variables are defined directly in `apps/web/vitest.config.ts` under the `test.env` section.

### Test isolation with Testcontainers

<details>
<summary>Advanced: How tests run with isolated databases</summary>

The application uses [Testcontainers](https://testcontainers.com/) to provide isolated database instances for testing. Here's how it works:

1. **Global Setup** (`tests/global-setup.ts`): Starts PostgreSQL (and optionally Redis) containers before any tests run
2. **Per-test Database** (`tests/db/setup.ts`): Creates a unique database for each test file and applies migrations
3. **Table Reset**: Use `resetTables()` from `tests/db/utils.ts` in `beforeEach` hooks to clean data between tests

The database setup in `tests/db/setup.ts` mocks the `@acme/db` module to use the test database:

```ts title="tests/db/setup.ts"
import { vi } from "vitest";

import { PrismaClient } from "@acme/db/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
}).$extends(kyselyPrismaExtension);

vi.mock("@acme/db", () => ({
  db,
}));
```

You can then use the `db` object in your tests as you would normally:

```ts title="src/server/modules/auth/__tests__/auth.service.spec.ts"
import { resetTables } from "~tests/db/utils";

import { db } from "@acme/db";

describe("auth.service", () => {
  beforeEach(async () => {
    await resetTables(["VerificationToken", "User", "Account"]);
  });

  it("should create a verification token", async () => {
    // Test code using db...
    const token = await db.verificationToken.findUnique({
      where: { identifier: vfnIdentifier },
    });
    expect(token).toBeDefined();
  });
});
```

</details>

### Writing new integration tests for tRPC procedures

You can easily create a tRPC caller for testing using the helper functions in `tests/trpc.ts`:

| Function name       | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `createTestContext` | Creates a mock context with optional session data for authenticated/unauthenticated testing |
| `createTestCaller`  | Creates a tRPC caller using the app router                                                  |

Which can be used as follows:

```ts title="src/server/api/routers/__tests__/me.router.spec.ts"
import { TRPCError } from "@trpc/server";
import { resetTables } from "~tests/db/utils";
import { createTestCaller, createTestContext } from "~tests/trpc";

import { db } from "@acme/db";

describe("meRouter", () => {
  beforeEach(async () => {
    await resetTables(["User", "Account"]);
  });

  describe("get", () => {
    // Unauthenticated session example
    it("should throw UNAUTHORIZED error when user is not authenticated", async () => {
      const ctx = createTestContext(undefined);
      const caller = createTestCaller(ctx);

      try {
        await caller.me.get();
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toEqual("UNAUTHORIZED");
      }
    });

    // Authenticated session example
    it("should return user data when authenticated", async () => {
      // Create a test user
      const testUser = await db.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });

      const ctx = createTestContext({ session: { userId: testUser.id } });
      const caller = createTestCaller(ctx);
      const result = await caller.me.get();

      expect(result).toEqual({
        id: testUser.id,
        email: "test@example.com",
        name: "Test User",
        image: null,
      });
    });
  });
});
```

### Test file conventions

Tests should be placed in `__tests__` folders alongside the code they test, with a `.spec.ts` extension:

```
src/
  server/
    modules/
      auth/
        __tests__/
          auth.service.spec.ts
          auth.utils.spec.ts
    api/
      routers/
        __tests__/
          me.router.spec.ts
  validators/
    __tests__/
      auth.spec.ts
```

## MSW for Storybook

The application includes [MSW (Mock Service Worker)](https://mswjs.io/) setup for mocking tRPC requests in Storybook.

### Related MSW files

| File                      | Description                                   |
| ------------------------- | --------------------------------------------- |
| `tests/msw/trpc-msw.ts`   | tRPC MSW adapter configuration                |
| `tests/msw/handlers/*.ts` | MSW request handlers for different procedures |

### Example MSW handler

```ts title="tests/msw/handlers/auth.ts"
import { delay } from "msw";

import { trpcMsw } from "../trpc-msw";

export const authHandlers = {
  signIn: {
    success: () =>
      trpcMsw.auth.email.login.mutation(() => {
        return {
          email: "test@example.com",
          otpPrefix: "TST",
        };
      }),
    loading: () =>
      trpcMsw.auth.email.login.mutation(async () => {
        await delay("infinite");
        return {
          email: "never",
          otpPrefix: "TST",
        };
      }),
  },
};
```

## End-to-end (E2E) tests

E2E tests use [Playwright](https://playwright.dev/) with Testcontainers for database isolation. Tests are located in `apps/web/tests/e2e/`.

### Related E2E files

| File                                      | Description                                                  |
| ----------------------------------------- | ------------------------------------------------------------ |
| `apps/web/playwright.config.ts`           | Playwright configuration file                                |
| `apps/web/tests/e2e/*.test.ts`            | E2E test files                                               |
| `apps/web/tests/e2e/app-fixture.ts`       | Custom Playwright fixture with database setup/teardown       |
| `apps/web/tests/e2e/setup/db-setup.ts`    | Database container setup, migrations, and snapshot utilities |
| `apps/web/tests/e2e/setup/redis-setup.ts` | Redis container setup and flush utilities                    |
| `apps/web/.env.e2e`                       | Environment variables specifically for E2E testing           |

### Running Playwright (locally)

The E2E tests use Testcontainers to automatically spin up a PostgreSQL container, so you only need Docker running. The test server runs on port 3111 to avoid conflicts with development.

Run the tests with:

```sh
cd apps/web
pnpm e2e        # Run all E2E tests (headless in CI, browser locally)
pnpm e2e:ui     # Run with Playwright UI for debugging
```

The Playwright config automatically starts the Next.js dev server via `pnpm dev-e2e` before running tests.

### App fixture

The E2E tests use a custom Playwright fixture (`app-fixture.ts`) that provides:

1. **Database container**: Starts a PostgreSQL container with a fixed port (64321)
2. **Migrations**: Applies all Prisma migrations before tests run
3. **Snapshots**: Takes a database snapshot after setup, resets to it after each test
4. **Redis container**: Starts a Redis container with a fixed port (63799)
5. **Redis flush**: Flushes all Redis data after each test

```ts title="tests/e2e/app-fixture.ts"
import { test as baseTest } from "@playwright/test";

import {
  applyMigrations,
  resetDbToSnapshot,
  startDatabase,
  takeDbSnapshot,
} from "./setup/db-setup";
import { flushRedis as flushRedisFn, startRedis } from "./setup/redis-setup";

interface DatabaseFixture {
  databaseContainer: Awaited<ReturnType<typeof startDatabase>>;
  resetDatabase: () => Promise<void>;
}

interface RedisFixture {
  redisContainer: Awaited<ReturnType<typeof startRedis>>;
  flushRedis: () => Promise<void>;
}

const test = baseTest.extend<DatabaseFixture & RedisFixture>({
  databaseContainer: async ({}, use) => {
    const container = await startDatabase();
    await use(container);
  },

  resetDatabase: async ({ databaseContainer }, use) => {
    await use(async () => {
      await resetDbToSnapshot(databaseContainer);
    });
  },

  redisContainer: async ({}, use) => {
    const container = await startRedis();
    await use(container);
  },

  flushRedis: async ({ redisContainer }, use) => {
    await use(async () => {
      await flushRedisFn(redisContainer);
    });
  },
});

test.beforeAll(async ({ databaseContainer }) => {
  await applyMigrations(databaseContainer);
  await takeDbSnapshot(databaseContainer);
});

test.afterAll(async ({ databaseContainer, redisContainer }) => {
  await Promise.all([
    databaseContainer.container.stop(),
    redisContainer.container.stop(),
  ]);
});

test.afterEach(async ({ resetDatabase, flushRedis }) => {
  await Promise.all([resetDatabase(), flushRedis()]);
});

export { test };
```

### Writing new E2E tests

Import `test` from `app-fixture.ts` instead of `@playwright/test` so the setup for the database and Redis containers are included.

```ts title="tests/e2e/smoke.test.ts" {4}
import { expect } from "@playwright/test";

import { env } from "~/env";
import { test } from "./app-fixture";

test("go to /", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(`text=${env.NEXT_PUBLIC_APP_NAME}`);
});

test("test 404", async ({ page }) => {
  const res = await page.goto("/not-found");
  expect(res?.status()).toBe(404);
});
```

## Further reading

| Description              | Link                                      |
| ------------------------ | ----------------------------------------- |
| Vitest Documentation     | https://vitest.dev/                       |
| Playwright Documentation | https://playwright.dev/docs/writing-tests |
| Testcontainers           | https://testcontainers.com/               |
| MSW Documentation        | https://mswjs.io/                         |
