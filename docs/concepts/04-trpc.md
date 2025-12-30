# tRPC

tRPC allows us to write end-to-end typesafe APIs without any code generation or runtime bloat. It uses TypeScript's great inference to infer your API router's type definitions and lets you call your API procedures from your frontend with full typesafety and autocompletion. When using tRPC, your frontend and backend feel closer together than ever before, allowing for an outstanding developer experience.

## How do I use tRPC?

With tRPC, you write TypeScript functions on your backend, and then call them from your frontend. A simple tRPC procedure could look like this:

```ts title="~/server/api/routers/post/post.router.ts"
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { db } from '@acme/db'

const postRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.string())
    .query(({ input }) => {
      return db.post.findFirst({
        where: {
          id: input,
          select:
        },
      });
    }),
});
```

This is a tRPC procedure (equivalent to a route handler in a traditional backend) that first validates the input using [Zod](https://zod.dev/) - in this case, it's making sure that the input is a string. If the input is not a string it will send an informative error instead.

After the input, we chain a resolver function which can be either a [query](https://trpc.io/docs/reactjs/usequery), [mutation](https://trpc.io/docs/reactjs/usemutation), or a [subscription](https://trpc.io/docs/subscriptions). In our example, the resolver calls our database using our [prisma](./03-prisma.md) client and returns the user whose `id` matches the one we passed in.

You define your procedures in `<feature>.router.ts` which represent a collection of related procedures with a shared namespace. You may have one router for `auth`, one for `posts`, and additional subrouters for other features. These routers can then be merged into a single, centralized `appRouter`:

```ts title="~/server/api/root.ts"
export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  thread: threadRouter,
});
```

Now let's call the procedure on our frontend. tRPC exposes functions that creates `(query/mutation)Options` which lets your API calls to be typed and inferred. We can call our procedures from our frontend like this:

```tsx
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

const PostViewPage = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useQuery(trpc.post.byId.queryOptions());

  return (
    <div>
      <h1>
        {data.replies.map((reply) => (
          <span>{reply.content}</span>
        ))}
      </h1>
    </div>
  );
};
```

You'll immediately notice how good the autocompletion and typesafety is. As soon as you write `trpc.`, your routers will show up in autocomplete, and when you select a router, its procedures will show up as well. You'll also get a TypeScript error if your input doesn't match the validator that you defined on the backend.

## Inferring errors

### On the client

If you share the zod schema between the frontend and backend by using the schema inside `react-hook-form`, input errors can be inferred and displayed on the frontend before backend checks.

Example usage:

```tsx title="react-hook-form zod schema example"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addPostSchema } from "~/validators/post";
import { useTRPC } from "~/trpc/react";

function MyComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    trpc.post.add.mutationOptions({
      async onSuccess({ id }) {
        // refetches posts after a post is added
        await queryClient.invalidateQueries({
          queryKey: trpc.post.list.queryKey(),
        });
        router.push(`${FEEDBACK}/${id}`);
      },
      onError: (error) => {
        toast({ description: error.message });
      },
    })
  );

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(addPostSchema),
  });

  return (
    <form onSubmit={handleSubmit((input) => mutation.mutate(input))}>
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState: { error } }) => (
          <TextField
            errorMessage={error?.message}
            isRequired
            isInvalid={!!error}
            {...field}
            label="Post title"
          />
        )}
      />
      {/* ... */}
    </form>
  );
}
```

### On the server

The tRPC [error formatter](https://trpc.io/docs/error-formatting) has been set up in `~/server/api/trpc.ts` that lets you infer your Zod Errors if you get validation errors on the backend.

Catching such errors could be optional if the zod schemas are already shared on the client and the client is already validating the input.

Example usage:

```ts title="Example of not using react-hook-form (but not recommended)"
function MyComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation(
    trpc.post.add.mutationOptions({
      async onSuccess({ id }) {
        // refetches posts after a post is added
        await queryClient.invalidateQueries({
          queryKey: trpc.post.list.queryKey(),
        });
        router.push(`${FEEDBACK}/${id}`);
      },
      onError: (error) => {
        toast({ description: error.message });
      },
    })
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      mutate({ title: formData.get('title') });
    }}>
      <input name="title" />
      {error?.data?.zodError?.fieldErrors.title && (
        {/** `mutate` returned with an error on the `title` */}
        <span className="mb-8 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </span>
      )}

      {/** ... */}
    </form>
  );
}
```

## Files

:::note
For brevity, we will use `~` to refer to the `~` folder in the following file paths.
:::

tRPC requires quite a lot of boilerplate that Starter Kit sets up for you. Let's go over the files that are generated:

### 📄 `~/app/api/trpc/[trpc]/route.ts`

This is the entry point for your API and exposes the tRPC router. Normally, you won't touch this file very much, but if you need to, for example, enable CORS middleware or similar to the Next.js API handler, this is the place to do it.

### 📄 `~/server/api/trpc.ts`

This file handles tRPC initialization:

We initialize tRPC and define reusable [procedures](https://trpc.io/docs/server/procedures) and [middlewares](https://trpc.io/docs/server/middlewares). By convention, you shouldn't export the entire `t`-object but instead, create reusable procedures and middlewares and export those.

You'll notice we use `superjson` as [data transformer](https://trpc.io/docs/server/data-transformers). This makes it so that your data types are preserved when they reach the client, so if you for example send a `Date` object, the client will return a `Date` and not a string which is the case for most APIs.

This file also defines the context that is passed to your tRPC procedures. Context is data that all of your tRPC procedures will have access to, and is a great place to put things like authentication information.

### 📄 `~/server/modules/<module>/<module>.router.ts`

This is where you define the routes and procedures of your API. By convention, you [create separate routers](https://trpc.io/docs/server/routers) for related procedures.

### 📄 `~/server/api/root.ts`

Here we [merge](https://trpc.io/docs/server/merging-routers) all the sub-routers defined in `*.router.ts` into a single app router.

### 📄 `~/trpc/react.tsx`

This is the frontend entry point for tRPC. This is where you'll import the router's **type definition** and create your tRPC client along with the react-query hooks. Since we enabled `superjson` as our data transformer on the backend, we need to enable it on the frontend as well. This is because the serialized data from the backend is deserialized on the frontend.

You'll define your tRPC [links](https://trpc.io/docs/client/links) here, which determines the request flow from the client to the server. We use the "default" [`httpLink`](https://trpc.io/docs/client/links/httpLink), as well as a [`loggerLink`](https://trpc.io/docs/client/links/loggerLink) which outputs useful request logs during development.

:::info
We do not use `httpBatchLink` (which enables [request batching](https://cloud.google.com/compute/docs/api/how-tos/batch)) by default, as there still exists a Denial of Service possibility where an attacker could send a large number of requests in a single batch, potentially overwhelming the server.
:::

### 📄 `~/trpc/types.ts`

Lastly, we export [helper types](https://trpc.io/docs/infer-types#additional-dx-helper-type) `RouterInput` and `RouterOutput`, which you can use to infer your types on the frontend.

## How do I call my API externally?

With regular APIs, you can call your endpoints using any HTTP client such as `curl`, `Postman`, `fetch` or straight from your browser. With tRPC, it's a bit different. If you want to call your procedures without the tRPC client, there are two recommended ways to do it:

### Expose a single procedure externally

If you want to expose a single procedure externally, you can use [Next.js's Route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) with tRPC [server side calls](https://trpc.io/docs/server/server-side-calls). That would allow you to create a normal Next.js API endpoint, but reuse the resolver part of your tRPC procedure.

```ts title="~/app/api/posts/[id]/route.ts"
import type { NextApiRequest, NextApiResponse } from "next";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

import { createCaller } from "~/trpc/server";

const postByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const caller = await createCaller();
  try {
    const { id } = req.query;
    const user = await caller.post.byId({ id: String(id) });
    res.status(200).json(user);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occured
    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default postByIdHandler;
```

### Exposing every procedure as a REST endpoint

If you want to expose every single procedure externally, checkout the community built plugin [trpc-to-openapi](https://www.npmjs.com/package/trpc-to-openapi). By providing some extra meta-data to your procedures, you can generate an OpenAPI compliant REST API from your tRPC router.

### It's just HTTP Requests

tRPC communicates over HTTP, so it is also possible to call your tRPC procedures using "regular" HTTP requests. However, the syntax can be cumbersome due to the [RPC protocol](https://trpc.io/docs/rpc) that tRPC uses. If you're curious, you can check what tRPC requests and responses look like in your browser's network tab, but we suggest doing this only as an educational exercise and sticking to one of the solutions outlined above.

## Useful snippets

Here are some snippets that might come in handy.

### Enabling CORS

If you need to consume your API from a different domain, for example in a monorepo that includes a React Native app, you might need to enable CORS:

```ts title="src/pages/api/trpc/[trpc].ts"
import { type NextApiRequest, type NextApiResponse } from "next";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "~/server/modules/_app";
import { createContext } from "~/server/context";
import cors from "nextjs-cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Enable cors
  await cors(req, res);

  // Create and call the tRPC handler
  return createNextApiHandler({
    router: appRouter,
    createContext,
  })(req, res);
};

export default handler;
```

### Optimistic updates

Optimistic updates are when we update the UI before the API call has finished. This gives the user a better experience because they don't have to wait for the API call to finish before the UI reflects the result of their action. However, apps that value data correctness highly should avoid optimistic updates as they are not a "true" representation of backend state. You can read more on the [React Query docs](https://tanstack.com/query/v4/docs/guides/optimistic-updates).

```tsx
const MyComponent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const listPostQuery = useQuery(trpc.post.list.queryOptions());

  const postCreate = useMutation(
    trpc.post.create.mutationOptions({
      async onMutate(newPost) {
        // Cancel outgoing fetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: trpc.post.list.queryKey(),
        });

        // Get the data from the queryCache
        const prevData = queryClient.getQueryData(trpc.post.list.queryKey());

        // Optimistically update the data with our new post
        queryClient.setQueryData(trpc.post.list.queryKey(), (old) => [
          ...old,
          newPost,
        ]);

        // Return the previous data so we can revert if something goes wrong
        return { prevData };
      },
      onError(err, newPost, ctx) {
        // If the mutation fails, use the context-value from onMutate
        queryClient.setQueryData(trpc.post.list.queryKey(), ctx.prevData);
      },
      onSettled() {
        // Sync with server once mutation has settled
        queryClient.invalidateQueries({ queryKey: trpc.post.list.queryKey() });
      },
    })
  );
};
```

### Sample Integration Test

Here is a sample integration test that uses [Vitest](https://vitest.dev) to check that your tRPC router is working as expected, the input parser infers the correct type, and that the returned data matches the expected output.

```ts
// Mocked versions of TRPC's context and caller that does not use
// any Next.js server specific functions
import { createTestCaller, createTestContext } from "~tests/trpc";

import { RouterInputs } from "~/trpc/types";

test("example router", async () => {
  const ctx = createTestContext(undefined);
  const caller = createTestCaller(ctx);
  const input: RouterInputs["example"]["hello"] = {
    text: "test",
  };

  const example = await caller.example.hello(input);

  expect(example).toMatchObject({ greeting: "Hello test" });
});
```

If your procedure is protected, you can pass in a mocked session object when you create the context:

```ts
test("protected example router", async () => {
  const ctx = createTestContext({ userId: "some-id" });
  const caller = createTestCaller(ctx);

  // ...
});
```

## Useful Resources

| Resource               | Link                                                    |
| ---------------------- | ------------------------------------------------------- |
| tRPC Docs              | https://www.trpc.io                                     |
| Bunch of tRPC Examples | https://github.com/trpc/trpc/tree/next/examples         |
| React Query Docs       | https://tanstack.com/query/v4/docs/adapters/react-query |
