# Using new tRPC procedure

This section will talk about how to use the new procedure in the application. We will be skipping most component related code, and focus on how to use tRPC client code.

#### Related documentation

- [tRPC client](https://trpc.io/docs/client/introduction)
- [tRPC NextJS integration](https://trpc.io/docs/nextjs/introduction)
- [tRPC react-query integration](https://trpc.io/docs/reactjs/introduction)

### Using the tRPC mutation ("frontend")

In the component where the reply feature is to be submitted, we will use the tRPC mutation to submit the reply.

```tsx title=src/features/feedback/components/FeedbackCommentRichText.tsx
import { trpc } from '~/utils/trpc'

export const ReplyRichText () => {
  // Note the nesting, which comes from the router structure.
  // `thread` is the name of the subrouter declared above, while
  // `reply` is the name of the procedure declared in the subrouter.
  const mutation = trpc.thread.reply.useMutation()
}
```

The mutation can then be called with the input data, which in this instance is validated by `react-hook-form`.
The application exposes the `useZodForm` hook, which is a wrapper around `react-hook-form` that uses `zod` for validation.
Note how `addReplySchema` (originally used in the tRPC procedure's input) can be reused to validate the input data.

```tsx
import { useZodForm } from '~/lib/form'
import { addReplySchema } from '~/schemas/thread'

export const ReplyRichText () => {
  const utils = trpc.useContext()
  const mutation = trpc.thread.reply.useMutation({
    onSuccess: async () => {
      reset()
      // refetches posts after a comment is added
      await utils.post.list.invalidate()
      await utils.post.byId.invalidate({ id: postId })
    }
  })

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
  } = useZodForm({
    schema: addReplySchema.omit({ postId: true }),
  })

  const handleSubmitFeedback = handleSubmit((values) => {
    // Types will automatically be inferred from the tRPC procedure's input.
    return mutation.mutateAsync({ ...values, postId })
  })

  // Component code...
}
```

Code similar to the above example can be found in [this component](https://github.com/opengovsg/starter-kit/blob/develop/src/features/feedback/components/FeedbackCommentRichText.tsx)
