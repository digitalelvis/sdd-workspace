import fs from "fs";
import path from "path";
import chalk from "chalk";
import { StackProvider, SetupOptions } from "../../domain/contracts/StackProvider";
import { RegistryLoader } from "../../resources/RegistryLoader";
import { ResourcePathUtils } from "../../utils/ResourcePathUtils";

export class EcosystemEngine {
  public setup(targetDir: string, stackProviders: StackProvider[], selectedIde: string | undefined, options: SetupOptions): void {
    
    // 1. Run Stack Providers
    for (const stackProvider of stackProviders) {
      stackProvider.setupEcosystem(targetDir, options);
    }

    // 2. Provision Ide Configs from Registry
    if (selectedIde) {
       this.provisionIde(targetDir, selectedIde);
    }
  }

  private provisionIde(targetDir: string, ideName: string): void {
    const registry = RegistryLoader.load();
    const ideDef = registry.ides[ideName.toLowerCase()];

    if (!ideDef) {
      console.warn(chalk.yellow(`⚠️ No registry definition found for IDE: ${ideName}`));
      return;
    }

    const configDir = path.join(targetDir, ideDef.configDir);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    if (ideDef.files) {
      const basePath = ResourcePathUtils.getResourcesPath();

      for (const fileDef of ideDef.files) {
        const sourcePath = path.join(basePath, fileDef.template);
        const targetPath = path.join(configDir, fileDef.target);

        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(chalk.green(`  ↳ Provisioned ${fileDef.target} from template.`));
        }
      }
    }

    console.log(chalk.green(`✔️  Prepared ${ideName} local workspace config at ${ideDef.configDir}/`));
  }
}
