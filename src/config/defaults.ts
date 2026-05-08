import { AiAgent } from "../domain/enums/AiAgent";
import { WorkspaceConfig } from "./ConfigSchema";

/**
 * Hard-coded built-in defaults — the bottom of the 4-layer config hierarchy.
 * These are the values the CLI uses when no global or local config overrides them.
 * Centralises defaults that were previously scattered across StackProviders and index.ts.
 */
export const BUILT_IN_DEFAULTS: Required<Pick<WorkspaceConfig, "agents" | "ide" | "lint" | "skills">> = {
  agents: [AiAgent.CURSOR],
  ide: "none",
  lint: true,
  skills: {
    include: [],
    exclude: [],
    add: [],
  },
};

/** Current config file version — bump when schema changes require migration */
export const CONFIG_VERSION = "0.0.2";

/** Filename for the local project-level config */
export const LOCAL_CONFIG_FILENAME = "sdd.yml";

/** Filename for the global user-level config */
export const GLOBAL_CONFIG_FILENAME = ".sddrc.yml";

/** Path for the global user-level config */
export const GLOBAL_CONFIG_PATH = `${process.env.HOME ?? "~"}/${GLOBAL_CONFIG_FILENAME}`;
