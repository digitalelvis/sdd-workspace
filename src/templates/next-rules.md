# Next.js Application Engineering Rules

1. **Prioritize Server Components:** By default, all newly generated components must be React Server Components. Only place `'use client'` explicitly at the top of the file when strictly needing interactivity (hooks like `useState`, `useEffect`) or browser web APIs.
2. **Server Actions First:** For forms and data mutations, utilize React Server Actions before falling back to Route Handlers (`/api/`), unless building a public-facing REST API.
3. **Strict Typings:** Enforce strict TypeScript typing across all boundaries, particularly on DB querying results and React Props.
4. **Performance:** Aggressively utilize `next/image`, `next/link`, and `next/font` for optimizations to preserve Core Web Vitals.

## Spec-Driven Rules [CRITICAL]

Do not write code based on vibes or simple guesses. You must consult the living specifications inside `/specs`, `/plans`, and `/tasks`. Update the task list frequently.
