# Architecture

## Design Patterns

- **Strategy Pattern**: Used for `Providers` (IDEs, Agents, Stacks). Each provider type implements a common contract, allowing the engine to support multiple implementations without changing core logic.
- **Facade Pattern**: The `WorkspaceService` acts as a high-level facade for the complex orchestration of analyzers, engines, and providers.
- **Factory Pattern**: Used in engines (e.g., `EcosystemEngine`) to instantiate the correct provider based on configuration or auto-detection.

## Layers

1. **CLI Layer (`src/cli`)**: Handles command registration, argument parsing, and user interaction (prompts).
2. **Orchestration Layer (`src/scaffolder`)**: Contains the `WorkspaceService` and specialized `Engines` that coordinate the mapping of specs to files.
3. **Domain Layer (`src/domain`)**: Defines the shared language of the system through Enums and Interfaces (Contracts).
4. **Provider Layer (`src/scaffolder/providers`)**: Implementation-specific logic for different IDEs (VSCode, Cursor), Agents (Windsurf, etc.), and Tech Stacks.
5. **Config Layer (`src/config`)**: Handles multi-layered configuration resolution (Default -> Global -> Local -> CLI).
6. **Analyzer Layer (`src/analyzer`)**: Logic for inspecting the target workspace to auto-detect its characteristics.

## Data Flow

1. User runs a command (e.g., `sdd init`).
2. `CliHandler` delegates to the specific command action.
3. `ConfigResolver` merges configuration sources.
4. `WorkspaceService` is invoked with the resolved config.
5. `WorkspaceService` uses `Analyzer` to detect the environment if needed.
6. `WorkspaceService` uses `Engines` to select and execute `Providers`.
7. `Providers` generate/update files in the workspace.
