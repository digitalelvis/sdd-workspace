import fs from "fs";
import path from "path";
import chalk from "chalk";

export class CICDEngine {
  public setup(targetDir: string, basePath: string, stacks: string[]): void {
    const primaryStack = stacks[0] || "nodejs";
    const cicdSource = path.join(basePath, "cicd", "github", `${primaryStack}.yml`);
    const cicdDestDir = path.join(targetDir, ".github", "workflows");
    const cicdDestFile = path.join(cicdDestDir, "pipeline.yml");

    if (fs.existsSync(cicdSource)) {
      if (!fs.existsSync(cicdDestDir)) {
        fs.mkdirSync(cicdDestDir, { recursive: true });
      }
      
      if (!fs.existsSync(cicdDestFile)) {
        fs.copyFileSync(cicdSource, cicdDestFile);
        console.log(chalk.green(`✔️  Provisioned GitHub Actions CI/CD pipeline for ${primaryStack}.`));
      }
    } else {
      // Fallback to nodejs if specific stack template not found
      const fallbackSource = path.join(basePath, "cicd", "github", "nodejs.yml");
      if (fs.existsSync(fallbackSource) && !fs.existsSync(cicdDestFile)) {
        if (!fs.existsSync(cicdDestDir)) fs.mkdirSync(cicdDestDir, { recursive: true });
        fs.copyFileSync(fallbackSource, cicdDestFile);
        console.log(chalk.green("✔️  Provisioned generic GitHub Actions CI/CD pipeline."));
      }
    }
  }
}
