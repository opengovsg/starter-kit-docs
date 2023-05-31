# Environment variables

This application uses `zod` for validating environment variables at both runtime and buildtime by providing additional login in `src/env.mjs` and `src/browserEnv.mjs`.

:::note Why `.mjs`?
This allows `next.config.mjs` to import the environment variables at runtime without going through a transpiler step, and throw an error if the current environment fails any validation.
:::

## env.mjs

:::info tldr?
If you want to add a new environment variable, you need to add it to both `.env` as well as define a validation in `src/env.mjs`.
:::

This file is split into two main parts:
1. the schema and object destructuring,
2. as well as the validation logic. The validation logic should not need to be touched.

```js title="src/env.mjs"
const client = z.object({
  NEXT_PUBLIC_ENABLE_STORAGE: coerceBoolean.default('false'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Starter Kit'),
  // ...
})

const server = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    // ...
  })
  /**
   * Add on schemas as needed that requires conditional 
   * validation.
   */
  .merge(/** zod schema */)
  .merge(client)
  /** 
   * Add on refinements as needed for conditional environment 
   * variables 
   */
  // .refine((val) => ...)

const processEnv = {
  // Server-side env vars
  NODE_ENV: process.env.NODE_ENV,
  //...
  // Client-side env vars
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  // ...
}

```
### Conditional validation 
_For the interested reader:_
<details>
 <summary> Advanced: Conditional validation</summary>
 <div>

 This application also has an example of conditional environment variable validation, where the environment variables required for storage layer capabilities (using R2) is only validated if the `NEXT_PUBLIC_ENABLE_STORAGE` flag is set to `true`.

```js title="src/env.mjs"
// All optional keys, so that we can validate the flag first.
const baseR2Schema = z.object({
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_PUBLIC_HOSTNAME: z.string().optional(),
  R2_AVATARS_BUCKET_NAME: z.string().optional(),
})

// Use discriminated union to validate different schemas
// based on the NEXT_PUBLIC_ENABLE_STORAGE flag.
const r2ServerSchema = z.discriminatedUnion('NEXT_PUBLIC_ENABLE_STORAGE', [
  /**
   * If the flag is enabled, then we require the keys.
   */
  baseR2Schema.extend({
    NEXT_PUBLIC_ENABLE_STORAGE: z.literal(true),
    // Add required keys if flag is enabled.
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_PUBLIC_HOSTNAME: z.string().min(1),
  }),
  /**
   * If the flag is disabled, then the base optional keys are 
   * not changed.
   */
  baseR2Schema.extend({
    NEXT_PUBLIC_ENABLE_STORAGE: z.literal(false),
  }),
])
```

Having this discriminated union allows you to validate that certain environment variables are required based on the value of another environment variable, using `zod#refine`:

```js title="src/env.mjs"
const server = z
  .object({/** ... */})
  // Add on schemas as needed that requires conditional validation.
  .merge(baseR2Schema)
  .merge(client)
  .refine((val) => r2ServerSchema.safeParse(val).success, {
    message: 'R2 environment variables are missing',
    path: ['NEXT_PUBLIC_ENABLE_STORAGE'],
  })
```
 </div>
</details>

### Server schema
Define your server-side environment variables schema here.

Make sure you do not prefix keys here with `NEXT_PUBLIC` in order not to leak important secrets to the client.

### Client schema
Define your client-side environment variables schema here.

To expose them to the client you need to prefix them with `NEXT_PUBLIC`. Validation will fail if you don't to help you detect invalid configuration.

### processEnv object
Destruct the `process.env` here.

If the environment variables are not explicitly declared in process.env, NextJS will not include them in the build, which will cause the variables to be `undefined` during runtime.

TypeScript will help you make sure that you have destructed all the keys from both schemas via inference.


### Validation Logic

_For the interested reader:_

<details>
<summary>Advanced: Validation logic</summary>

Depending on the environment (server or client) we validate either both or just the client schema. This means that even though the server environment variables will be undefined, they won't trigger the validation to fail - meaning we can have a single entrypoint for our environment variables.

```ts title="src/env.mjs"
const isServer = typeof window === "undefined";

const merged = server.merge(client);
const parsed = isServer
  ? merged.safeParse(processEnv) // <-- on server, validate all
  : client.safeParse(processEnv); // <-- on client, validate only client

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(parsed.error.format()),
  );
  throw new Error("Invalid environment variables");
}
```

Then, we use a proxy object to throw errors if you try to access a server-side environment variable on the client.

```ts title="src/env.mjs"
// proxy allows us to remap the getters
export const env = new Proxy(parsed.data, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    // on the client we only allow NEXT_PUBLIC_ variables
    if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
      throw new Error(
        "❌ Attempted to access serverside environment variable on the client",
      );
    return target[prop]; // <-- otherwise, return the value
  },
});
```
</details>

## Using Environment Variables

When you want to use your environment variables, you can import them from `env.mjs` and use them as you would normally do. If you import this on the client and try accessing a server-side environment variable, you will get a runtime error.

```ts title="pages/api/hello.ts"
import { env } from "~/env.mjs";

// `env` is fully typesafe and provides autocompletion
const dbUrl = env.DATABASE_URL;
```

```ts title="pages/index.tsx"
import { env } from "~/env.mjs";

// ❌ This will throw a runtime error
const dbUrl = env.DATABASE_URL;

// ✅ This is fine
const appName = env.NEXT_PUBLIC_APP_NAME;
```

## .env.example

Since the default `.env` file is not committed to version control, we have also included a `.env.example` file, in which you can optionally keep a copy of your `.env` file with any secrets removed. This is not required, but we recommend keeping the example up to date to make it as easy as possible for contributors to get started with their environment.

Some frameworks and build tools, like Next.js, suggest that you store secrets in a `.env.local` file and commit `.env` files to your project. This is not recommended, as it could make it easy to accidentally commit secrets to your project. Instead, we recommend that you store secrets in `.env`, keep your `.env` file in your `.gitignore` and only commit `.env.example` files to your project.

## .env.test
There is also an `env.test` file to store test-specific environment variables separate from your `.env` file. This file will be commited to version control, so you can keep your test environment variables in sync with your team. 
See [Testing](./10-testing.md) for more information.

## Adding Environment Variables

To ensure your build never completes without the environment variables the project needs, you will need to add new environment variables in **two** locations:

📄 `.env`: Enter your environment variable like you would normally do in a `.env` file, i.e. `KEY=VALUE`

📄 `env.mjs`: Add the appropriate validation logic for the environment variable by defining a Zod schema, e.g. `KEY: z.string()`, and destruct the environment variable from `process.env` in the `processEnv` object, e.g. `KEY: process.env.KEY`.

Optionally, you can also keep `.env.example` updated:

📄 `.env.example`: Enter your environment variable, but be sure to not include the value if it is secret, i.e. `KEY=VALUE` or `KEY=`

### Example

_I want to add my Twitter API Token as a server-side environment variable_

1. Add the environment variable to `.env`:

```
TWITTER_API_TOKEN=1234567890
```

2. Add the environment variable to `env.mjs`:

```ts
export const server = z.object({
  // ...
  TWITTER_API_TOKEN: z.string(),
});

export const processEnv = {
  // ...
  TWITTER_API_TOKEN: process.env.TWITTER_API_TOKEN,
};
```

:::info
An empty string is still a string, so `z.string()` will accept an empty string as a valid value. If you want to make sure that the environment variable is not empty, you can use `z.string().min(1)`.
:::

3. _Optional:_ Add the environment variable to `.env.example`, but don't include the token

```
TWITTER_API_TOKEN=
```