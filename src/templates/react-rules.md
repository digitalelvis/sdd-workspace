# React (Vite/CRA) Application Engineering Rules

1. **Component Purity:** Keep components as pure functions as much as possible. Abstract complex state logic into custom hooks.
2. **State Management:** Use localized state (useState, useReducer) before jumping to global state (Zustand, Redux). Keep global state flat.
3. **Typings:** Strictly type all React Components, Props, and state variables using TypeScript.
4. **Data Fetching:** For client-side single-page applications, utilize robust fetching libraries like React Query or SWR instead of naive `useEffect` fetch calls.

## Spec-Driven Rules [CRITICAL]
Do not write code based on vibes or simple guesses. You must consult the living specifications inside `/specs`, `/plans`, and `/tasks`. Update the task list frequently.
