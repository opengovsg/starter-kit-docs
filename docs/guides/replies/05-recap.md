# Recap

To recap, we have added a new feature to the application, which is replying to posts.

1. We updated the Prisma schema to add new `parent` and `replies` relations to the `Post` model.
2. We ran the migration to update the database.
3. A tRPC `thread` subrouter was created for this feature, and the new router was added to the application router.
4. The `reply` mutation procedure was added to the `thread` subrouter, and the procedure's input was validated using `zod`.
5. The new procedure can automatically be used in the client application using the `trpc.thread.reply.useMutation()` hook that was automatically exposed by tRPC.
6. The input data can be validated using `zod` and `react-hook-form` before the mutation was called.
