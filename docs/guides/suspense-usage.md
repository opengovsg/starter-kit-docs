# Suspense Usage

Usage of React's default `Suspense` component will cause problems for queries which rely on Next's `router` instance to extract a query parameter. For more context, please view this PR [here] (https://github.com/opengovsg/starter-kit/pull/93)

To have `Suspense` usage, please import the custom `Suspense` component from the `/components` directory.

Thid component is just a thin wrapper around `Suspense` and exposes the same set of properties. For more information on `Suspense`, please refer to the official react docs [here](https://react.dev/reference/react/Suspense).

## Example usage with trpc

In the example below, when the `Post` component is retrieving post of id `1`, the fallback component specified in the `fallback` property containing **loading...** will render.

Once the post has been retrieved, the component will stop suspending and render the post's title.

```tsx
import Suspense from "~/components/Suspense/Suspense";

const Dashboard = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Post />
    </Suspense>
  );
};

const Post = () => {
  // instead of `useQuery`, use the `useSuspenseQuery` hook here
  const [post] = trpc.post.getById.useSuspenseQuery(1);

  return <p>{post.title}</p>;
};
```

# ErrorBoundary usage

A custom `ErrorBoundary` component is partially implemented to serve as a starting-point for handling different `TRPCClientError`s.

Currently, only the `NOT_FOUND` error conditionally renders a different component and all other errors will fallback to display an `UnexpectedErrorCard`.

To extend its usage to support other codes, simply add to the switch case statement of `ErrorComponent` to conditionally render the components according to the `TRPCErrors` received.

## Overriding all defaults

You may override the component to render when errors are faced by using the `fallback` prop. 

## Example Usage of ErrorBoundary + Suspense

In the example below, imagine retrieving post by an id of `-1` will throw a new `TRPCError({ code: 'NOT_FOUND' })` error. 

The component will stop suspending, then conditionally render the component in the switch case block of `ErrorComponent` which matches the `NOT_FOUND` case.

```tsx
import Suspense from "~/components/Suspense/Suspense";
import ErrorBoundary from "~/components/ErrorBoundary/ErrorBoundary";

const Dashboard = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>loading...</p>}>
        <Post />
      </Suspense>
    </ErrorBoundary>
  );
};

const Post = () => {
  // this throws a TRPCError of `NOT_FOUND`
  const [post] = trpc.post.getById.useSuspenseQuery(-1);

  return <p>{post.title}</p>;
};
```
