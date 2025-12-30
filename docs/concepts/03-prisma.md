# Prisma

Prisma is an ORM for TypeScript, that allows you to define your database schema and models in a `schema.prisma` file, and then generate a type-safe client that can be used to interact with your database from your backend.

## Prisma Client

Located at `packages/db/src/index.ts`, the Prisma Client is instantiated as a global variable (as recommended as [best practice](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#problem) by the team at Prisma) and exported to be used in your API routes.

## Schema

You will find the Prisma schema file at `packages/db/prisma/schema.prisma`. This file is where you define your database schema and models, and is used when generating the Prisma Client.

## Default Database

The default database in this application uses [Neon](./06-neon.md). You can change the database to use by changing the `provider` in the `datasource` to the database of your choice, and then updating the connection string within environment variables to point to your database.

## Seeding your Database

[Seeding your database](https://www.prisma.io/docs/guides/database/seed-database) is a great way to quickly populate your database with test data to help you get started. A `seed.ts` file (which currently does nothing) has already been created in this application in the `packages/db/prisma/` directory. The `seed` script in `package.json` is configured to run this file when you run `pnpm seed` in the database directory.

```json title="packages/db/package.json"
{
  "scripts": {
    "seed": "prisma db seed"
  }
}
```

```ts title="packages/db/prisma/seed.ts"
import { db } from "../src/index";

async function main() {
  const id = "cl9ebqhxk00003b600tymydho";
  await db.example.upsert({
    where: {
      id,
    },
    create: {
      id,
    },
    update: {},
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
```

Then, just run `pnpm seed` to seed your database.

## Useful Resources

| Resource                  | Link                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Prisma Docs               | https://www.prisma.io/docs/                                                                                                                      |
| Prisma GitHub             | https://github.com/prisma/prisma                                                                                                                 |
| Prisma Migrate Playground | https://playground.prisma.io/guides                                                                                                              |
| Database Connection Guide | https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql |
