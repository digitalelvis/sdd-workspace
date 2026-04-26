import { Command } from "commander";
import { registerCommands } from "./commands";
import pkg from "../../package.json";
import { WorkspaceValidator } from "../analyzer/WorkspaceValidator";

/**
 * CLI Handler — Configures the global program settings and registers commands.
 * This abstracts the Commander setup from the entrypoint.
 */
export async function runCli(): Promise<void> {
  const program = new Command();

  // Validate workspace environment (unless it's a version or help check)
  const skipValidation = process.argv.includes("--version") || process.argv.includes("-V") || process.argv.includes("--help") || process.argv.includes("-h");
  if (!skipValidation) {
    WorkspaceValidator.validateOrWarn(process.cwd());
  }

  program

    .name("sdd")
    .description("AI-SDD Workspace: Scaffolds an AI-friendly Spec-Driven Development ecosystem")
    .version(pkg.version); 


  // Register all modular commands
  registerCommands(program);

  // Parse arguments and execute actions
  program.parse(process.argv);

  // Fallback to help if no arguments provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}
