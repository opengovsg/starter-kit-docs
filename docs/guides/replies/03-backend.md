# Add tRPC procedures

We use tRPC for the application layer, and tRPC routers for the backend code.

### Vocabulary

Below are some commonly used terms in the tRPC ecosystem. We'll be using these terms throughout the docs, so it's good to get familiar with them and how they relate to each other.

| Term | Description |
| --- | --- |
| [Procedure](https://trpc.io/docs/server/procedures) | tRPC's equivalent to an API endpoint - can be a query, mutation, or a subscription |
| Query | A procedure that gets some data |
| Mutation | A procedure that creates/changes/deletes (i.e. mutates) some data |
| [Subscription](https://trpc.io/docs/subscriptions) | A procedure that listens to changes and gets a stream of messages |
| [Router](https://trpc.io/docs/server/routers) | A collection of procedures under a shared namespace. Can be nested with other routers. |
| [Context](https://trpc.io/docs/server/context) | Stuff accessible to all procedures (e.g. session state, db connection) |
| [Middleware](https://trpc.io/docs/server/middlewares) | Functions executed before and after procedures, can create new context |

#### Related documentation

- [tRPC quickstart](https://trpc.io/docs/quickstart)

### Adding new tRPC procedures ("backend")

With the commenting feature (and other features), we usually need to add CRUD (create, read, update, delete) related code to the application. The following sections will describe how to add such code.

There is already routers set up in the application, but replying to posts is a new feature and should be subject to its own router, and could make it it easier to reason about the code if it is separated.

#### Creating a new `thread` subrouter

For this feature, we will create a new router in `src/server/modules/thread/thread.router.ts`, since the feature as a whole seems to be about threads, and not just replies.

```ts
// src/server/modules/thread/thread.router.ts
export const threadRouter = router({
  // Add queries and mutations here.
});
```

#### Adding `reply` functionality

Replying to a post is a mutation, and as such we will add a `reply` procedure to the `threadRouter`.

> 🗒️ If the new feature was a READ database action, instead of a CREATE, UPDATE, or DELETE action, the procedure would have been a `query` instead of a `mutation`.

```ts
// src/server/modules/thread/thread.router.ts
export const threadRouter = router({
  reply: protectedProcedure // 🗒️ Exposed in src/server/trpc.ts to only allow authenticated users.
    .input(...)
    .mutation(...)
})
```

tRPC uses `zod` under the hood, and you can provide a schema to control what is allowed in the mutation's `input`.

```ts
// src/server/modules/thread/thread.router.ts
import { z } from 'zod'

export const threadRouter = router({
  reply: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        contentHtml: z.string().min(1),
        postId: z.string(),
      })
    )
    .mutation(...)
})
```

The mutation should then create a new reply `Post` in the database:

```ts
// src/server/modules/thread/thread.router.ts
export const threadRouter = router({
  reply: protectedProcedure.input(addReplySchema).mutation(
    async ({
      // Contains the validated input according to the shape declared in `.input`.
      input,
      // Contains the context, which is the `trpc` context declared in `src/server/context.ts`.
      ctx,
    }) => {
      const { postId, ...replyData } = input;
      return await ctx.prisma.$transaction(async (tx) => {
        const parent = await tx.post.findFirst({
          where: {
            id: postId,
            deletedAt: null,
          },
        });
        if (!parent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Post '${postId}' does not exist`,
          });
        }
        return await ctx.prisma.post.create({
          data: {
            ...replyData,
            author: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            parent: {
              connect: {
                id: postId,
              },
            },
          },
          // It is a best practice to be explicit about what fields are returned, to avoid
          // accidentally leaking sensitive data (especially if fields are added to the model).
          select: defaultReplySelect,
        });
      });
    }
  ),
});
```

#### Adding this new nested router to the application router

This new router should be added to the application router, which is located in `src/server/modules/_app.ts`.

```ts
// src/server/modules/_app.ts
export const appRouter = router({
  ...
  thread: threadRouter,
})
```

At this point, the new mutation will be available to the application.
