# Final Touches

## Complete the rest of the TODOs 
:::info
See all to-dos by searching for `TODO(example)` in the codebase.
:::
#### Files to change:
**Backend**
1. Modify default selects in `server/modules/post/post.select.ts` to include `replies`
1. Modify select filters in `server/modules/post/post.router.ts` to only return posts that are not replies. Optionally, implement the rest of the filters in the `list` route.

**Frontend**
1. Render the replies in `src/pages/feedback/[id].tsx` within the `<Stack>` component. Replies are returned in `data.replies` and should be mapped to the `<FeedbackComment>` component.
1. Show reply count in `features/feedback/components/TeamFeedbackRow.tsx`