# Environment variables

Starter Kit uses the [`@t3-oss/env-nextjs`](https://env.t3.gg/docs/nextjs) (and [`@t3-oss/env-core`](https://env.t3.gg/docs/core)) packages along with [`zod`](https://zod.dev/) under the hood for validating environment variables at runtime and buildtime by providing a simple logic in the various `env.ts` in the `apps` and `packages` directories.

## env.ts

:::info tldr?
If you want to add a new environment variable, you must add a validator for it in `*/env.ts`, and then add the KV-pair into your environment (usually via .env files locally, and via your deployment platform for production).
:::

For each package that requires environment variables, there is an `env.ts` file located at the root of the `src` directory. For example, for the web application, you can find it at `apps/web/src/env.ts`.

Use the appropriate library (`@t3-oss/env-nextjs` for Next.js apps, `@t3-oss/env-core` for other packages) to create the environment variable schema and validation logic.

```ts title="packages/db/env.ts"
import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
```

The `@t3-oss/env-*` packages uses the `createEnv` function to create the schema validation for both client and server-side environment variables.

:::info
For more information about how `createEnv` works internally, check out the [T3 Env](https://env.t3.gg/docs/introduction) docs
:::

## Using Environment Variables

When you want to use your environment variables, you can import them from the created `env.ts` and use them as you would normally do. If you import this on the client and try accessing a server-side environment variable, you will get a runtime error.

```ts title="pages/api/hello.ts"
import { env } from "~/env";

// `env` is fully typesafe and provides autocompletion
const dbUrl = env.DATABASE_URL;
```

```ts title="~/some/client/component.tsx"
"use client";

import { env } from "~/env";
// ❌ This will throw a runtime error
const dbUrl = env.DATABASE_URL;

// ✅ This is fine
const appName = env.NEXT_PUBLIC_APP_NAME;
```

## .env.example

Since the default `.env` file is not committed to version control, we have also included a `.env.example` file, in which you can optionally keep a copy of your `.env` file with any secrets removed. This is not required, but we recommend keeping the example up to date to make it as easy as possible for contributors to get started with their environment.

Some frameworks and build tools, like Next.js, suggest that you store secrets in a `.env.local` file and commit `.env` files to your project. This is not recommended, as it could make it easy to accidentally commit secrets to your project. Instead, we recommend that you store secrets in `.env`, keep your `.env` file in your `.gitignore` and only commit `.env.example` files to your project.

## Adding Environment Variables

To ensure your build never completes without the environment variables the project needs, you will need to add new environment variables in **two** locations:

📄 `.env`: Enter your environment variable like you would normally do in a `.env` file, i.e. `KEY=VALUE`

📄 `env.ts`: Add the appropriate validation logic for the environment variables by defining a Zod schema inside `createEnv` for each one, e.g. `KEY: z.string()`. Besides that, make sure to destruct them in the `runtimeEnv` option, e.g.: `KEY: process.env.KEY`

:::info
Why do I need to destructure the environment variable in `runtimeEnv`? This is due to how Next.js bundles environment variables in certain runtimes. By destructuring it manually, you ensure that the variable will never be stripped out from the bundle.
:::

Optionally, you can also keep `.env.example` updated:

📄 `.env.example`: Enter your environment variable, but be sure to not include the value if it is secret, i.e. `KEY=VALUE` or `KEY=`

### Example

_I want to add my Twitter API Token as a server-side environment variable_

1. Add the environment variable to `.env`:

```
TWITTER_API_TOKEN=1234567890
```

2. Add the environment variable to the appropriate `env.ts` (or multiple `env.ts` if needed):

```ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TWITTER_API_TOKEN: z.string(),
  },
  // ...
  runtimeEnv: {
    // ...
    TWITTER_API_TOKEN: process.env.TWITTER_API_TOKEN,
  },
});
```

3. _Optional:_ Add the environment variable to `.env.example`, but don't include the token

```
TWITTER_API_TOKEN=
```

## Type Coercion

All variables you add to `.env` will be imported as strings, even if their value is intended to represent a different type. If you want to use your environment variables as a different type at runtime, you can use Zod’s `coerce` to convert the string to the type you want. It will throw if the coercion fails.

Add the variables to your `.env`:

```
SOME_NUMBER=123
SOME_BOOLEAN=true
```

Then, in your `env.ts`, use `z.coerce` to convert them to the desired type:

```ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SOME_NUMBER: z.coerce.number(),
    SOME_BOOLEAN: z.coerce.boolean(),
  },
  // ...
  runtimeEnv: {
    SOME_NUMBER: process.env.SOME_NUMBER,
    SOME_BOOLEAN: process.env.SOME_BOOLEAN,
  },
});
```
