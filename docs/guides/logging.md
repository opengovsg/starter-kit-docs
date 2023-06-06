# Logging

A `loggerMiddleware` has been set on all procedures with a `path` key which reflects the trpc method that was invoked.

The `path` context is especially useful for method-level observability purposes.

## Example usage

Simply get `logger` object from the procedure's context.

`post.router.ts`

```ts
export const postRouter = router({
  listMany: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx: { logger } }) => {
      logger.info("your input is", { input });
    }),
});
```

The log statement above will output the following when `listMany` has been invoked with an input of `1`.

```json
{
  "message": "your input is",
  "input": "1",
  "path": "post.listMany"
}
```

# Default log statements

The following actions are logged by default (see `loggerMiddleware` for more info):

- Per path completion time with `durationInMs`
- Error logs on any error
  - Errors will contain the following:
    - `message` attribute of `failure`
    - `error` attribute containing the error thrown
