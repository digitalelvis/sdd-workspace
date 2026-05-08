# GitHub Flow (Agile/CD)

The project follows the GitHub Flow strategy for continuous delivery.

## Branching Conventions

- **`main`**: The primary branch. It must always be deployable.
- **Feature Branches**: Branch directly off `main` for new work. Name them descriptively, e.g., `add-new-payment-gateway` or `fix-login-bug`.
- Avoid long-lived feature branches. Merge frequently.

## Commit Conventions

- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- Ensure commits are atomic and focused.

## Merging

- Open a Pull Request (PR) against `main`.
- Require code review and CI checks to pass before merging.
- Prefer squash and merge or rebase to keep the `main` history clean.
