# Node.js Application Engineering Rules

1. **Async Patterns:** Always enforce modern strictly typed `async/await` patterns. Do not use outdated `.then().catch()` chains.
2. **Architecture:** Decouple Business Logic from Transport Layers (HTTP routes or Controllers). Keep services functionally pure when possible.
3. **Error Handling:** Ensure robust error mapping mechanisms. Throw custom application errors and catch them in a centralized error middleware.
4. **Typings:** All Request schemas and Response payloads must be heavily typed (e.g., using Zod or TS native interfaces).

## Spec-Driven Rules [CRITICAL]

Do not write code based on vibes or simple guesses. You must consult the living specifications inside `/specs`, `/plans`, and `/tasks`. Update the task list frequently.
