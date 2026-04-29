# Jira-Driven Environment Flow (Enterprise)

This project strictly adheres to a Jira-driven workflow to ensure end-to-end traceability between code and requirements.

## Branching Conventions

- All branch names **MUST** begin with the Jira Issue Key (e.g., `PROJ-123`).
- **Format**: `<JIRA-ID>-<type>/<short-description>`
- **Example**: `PROJ-123-feat/user-authentication` or `PROJ-456-fix/null-pointer`

## Environment Mapping

- Branches mapped to specific environments require Jira status updates.
- **`staging`**: Pre-production environment. Code merged here implies the Jira ticket is ready for QA.
- **`production` / `main`**: Production environment. Code merged here implies the Jira ticket is done.

## Commit Conventions

- Every commit message **MUST** contain the Jira Issue Key.
- **Example**: `feat(auth): PROJ-123 implement OAuth login`

## Process Flow

1. Create a branch linked to the Jira ticket.
2. Commit code with the Jira ID in the message.
3. Open a Pull Request referencing the Jira ID.
4. CI/CD pipelines will block merges if the Jira ID is missing or invalid.
