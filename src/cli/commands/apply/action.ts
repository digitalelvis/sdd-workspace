import chalk from "chalk";
import { WorkspaceService } from "../../../scaffolder/WorkspaceService";
import { ConfigResolver } from "../../../config/ConfigResolver";
import { LOCAL_CONFIG_FILENAME } from "../../../config/defaults";

/**
 * Action handler for the 'sdd apply' command.
 * Re-synchronizes the workspace based on the existing sdd.config.json.
 */
export async function applyAction(): Promise<void> {
  console.log(chalk.blue.bold("\n🔄 Applying SDD Workspace Configuration...\n"));

  const targetDir = process.cwd();
  const resolver = new ConfigResolver();
  const orchestrator = new WorkspaceService();

  const localConfig = resolver.loadLocalConfig(targetDir);
  if (!localConfig) {
    console.error(chalk.red(`\n❌ No ${LOCAL_CONFIG_FILENAME} found in the current directory.`));
    console.log(chalk.yellow(`   Run ${chalk.bold("sdd init")} first to initialize your workspace.`));
    process.exit(1);
  }

  console.log(chalk.cyan(`  Found ${LOCAL_CONFIG_FILENAME} — resolving configuration...`));

  // 1. Resolve with local config as the primary source
  const resolved = resolver.resolve(
    { agents: localConfig.agents, ide: localConfig.ide, lint: localConfig.lint, stacks: localConfig.stacks },
    targetDir,
  );

  // 2. Execute re-injection
  console.log(chalk.cyan(`[Injector] Re-injecting AI engineering rules and SDD framework...\n`));
  await orchestrator.execute(targetDir, resolved);

  // 3. Update timestamp in sdd.config.json
  const updated = resolver.generateLocalConfigContent(resolved);
  orchestrator.writeLocalConfig(targetDir, updated);

  console.log(chalk.green.bold("\n✨ Workspace successfully re-applied!"));
}
