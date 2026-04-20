import { Command } from "commander";
import chalk from "chalk";
import { GlobalConfigManager } from "../../../config/GlobalConfigManager";

/**
 * Registry for 'sdd config' subcommands.
 */
export function makeConfigCommand(program: Command): void {
  const config = program
    .command("config")
    .description("Manage global SDD configuration (~/.sddrc.json)");

  config
    .command("set <path> <value>")
    .description("Set a global configuration value (e.g. 'defaults.ide cursor')")
    .action((path, value) => {
      const manager = new GlobalConfigManager();
      
      // Auto-parse arrays if comma-separated
      let parsedValue: any = value;
      if (value.includes(",")) {
        parsedValue = value.split(",").map((s: string) => s.trim());
      } else if (value === "true") {
        parsedValue = true;
      } else if (value === "false") {
        parsedValue = false;
      }

      manager.set(path, parsedValue);
      console.log(chalk.green(`✅ Global config '${path}' updated to: ${chalk.bold(JSON.stringify(parsedValue))}`));
    });

  config
    .command("get <path>")
    .description("Get a global configuration value")
    .action((path) => {
      const manager = new GlobalConfigManager();
      const value = manager.get(path);
      if (value === undefined) {
        console.log(chalk.yellow(`⚠️  Config '${path}' not found in global settings.`));
      } else {
        console.log(chalk.cyan(`${path}: ${chalk.bold(JSON.stringify(value, null, 2))}`));
      }
    });

  config
    .command("list")
    .description("List all global configuration settings")
    .action(() => {
      const manager = new GlobalConfigManager();
      const data = manager.load();
      console.log(chalk.blue.bold("\n🌍 Global SDD Configuration:"));
      console.log(chalk.gray(`Path: ${manager.getConfigPath()}\n`));
      
      if (Object.keys(data).length === 0) {
        console.log(chalk.yellow("  (Empty)"));
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
      console.log("");
    });
}
