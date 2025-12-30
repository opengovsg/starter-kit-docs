# Next.js

Next.js is a full-stack React framework that enables you to build fast, production-ready web applications with server-side rendering, static generation, and more.

## Why should I use it?

Pairing Next.js with [Vercel](https://vercel.com/) makes developing and deploying web apps easier than ever before. Their extremely generous free-tier and super intuitive interface provides a point and click solution to deploy your site. Next.js 16 with the App Router provides a modern, streamlined development experience with React Server Components at its core.

## App Router

Next.js 16 uses the **App Router** as the default and recommended routing paradigm. The App Router is built on top of React Server Components, enabling you to build applications that span the server and client.

### Key Concepts

#### File-based Routing

Routes are defined by the folder structure inside the `app` directory:

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[slug]/page.tsx` → `/blog/:slug` (dynamic route)

#### Special Files

| File            | Purpose                                       |
| --------------- | --------------------------------------------- |
| `page.tsx`      | Defines the UI for a route segment            |
| `layout.tsx`    | Shared UI that wraps pages and nested layouts |
| `loading.tsx`   | Loading UI with React Suspense                |
| `error.tsx`     | Error boundary for a route segment            |
| `not-found.tsx` | UI for 404 errors                             |

### Server Components vs Client Components

By default, all components in the App Router are **React Server Components**. This means they:

- Run only on the server
- Have zero client-side JavaScript bundle impact
- Can directly access backend resources (databases, file system, etc.)

To create a **Client Component** (for interactivity, hooks, browser APIs), add the `"use client"` directive at the top of your file:

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Data Fetching

#### In Server Components

In the App Router, data fetching is simplified with `async`/`await` directly in Server Components:

```tsx title="app/posts/page.tsx"
import { createCaller } from "~/trpc/server";

export default async function PostsPage() {
  const caller = await getCaller();
  const posts = await caller.posts.getAll();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

#### In Client Components

Starter Kit uses [tRPC](https://trpc.io/) for type-safe API communication. You can use the `trpc` hook to fetch data in Client Components:

```tsx title="app/posts/PostsList.tsx"
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function PostsList() {
  const trpc = useTRPC();

  const { data: user, isLoading } = useQuery(trpc.posts.getAll.queryOptions());

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Server Actions

Server Actions allow you to define server-side functions that can be called directly from your components, but as Starter Kit uses tRPC for server-client communication, we recommend using tRPC procedures for similar functionality (and thus will not cover Server Actions here). You can read more about Server Actions in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions).

## Useful Resources

| Resource                       | Link                               |
| ------------------------------ | ---------------------------------- |
| Next.js Documentation          | https://nextjs.org/docs            |
| App Router Documentation       | https://nextjs.org/docs/app        |
| Next.js GitHub                 | https://github.com/vercel/next.js  |
| Next.js Blog                   | https://nextjs.org/blog            |
| Next.js Discord                | https://nextjs.org/discord         |
| Next.js Twitter                | https://twitter.com/nextjs         |
| Vercel/Next.js YouTube Channel | https://www.youtube.com/c/VercelHQ |

```

```
