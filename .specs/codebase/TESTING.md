# Testing

## Strategy

- **Unit Testing**: Primary focus on testing individual providers, engines, and utility functions.
- **Mocking**: Extensive use of mocks to isolate components from the filesystem and external dependencies.
- **Coverage**: Aim for high coverage in core engines and configuration resolution logic.

## Tools

- **Framework**: Jest
- **Direct TS Execution**: `ts-jest`
- **Commands**:
  - `npm run test`: Run all tests.
  - `npm run test:watch`: Run tests in watch mode.

## Patterns

- Tests are located in `tests/unit/`, mirroring the `src/` directory.
- Use `describe` blocks to group tests for specific classes/functions.
- Use `test` or `it` for individual test cases.
- Follow the Arrange-Act-Assert pattern.
