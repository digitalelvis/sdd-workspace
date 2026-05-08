import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { ResourceDefinition } from "../../domain/contracts/SkillRegistry";

/**
 * ResourceProvisioner — Handles the physical acquisition of resources (rules, skills).
 * Supports local copy, remote fetch, and git cloning.
 */
export class ResourceProvisioner {
  /**
   * Provision a resource based on its definition.
   */
  public async provision(
    resourceName: string,
    resourceDef: ResourceDefinition | undefined,
    targetDir: string,
    destDir: string,
    basePath: string
  ): Promise<void> {
    const resourceDestDir = path.join(destDir, resourceName);
    
    if (!fs.existsSync(resourceDestDir)) {
      fs.mkdirSync(resourceDestDir, { recursive: true });
    }

    if (!resourceDef) {
      this.processLocal(resourceName, basePath, destDir, false, false);
      return;
    }

    switch (resourceDef.mode) {
      case "cli":
        if (resourceDef.command) {
          console.log(chalk.gray(`    Executing external installer: ${resourceDef.command}`));
          execSync(resourceDef.command, { stdio: "inherit", cwd: targetDir });
        }
        break;

      case "remote":
        if (resourceDef.url) {
          await this.provisionRemote(resourceName, resourceDef, targetDir, resourceDestDir);
        }
        break;

      case "local": {
        const source = resourceDef.path || (resourceDef.resource === "rule" ? `rules/${resourceName}.md` : `skills/${resourceName}`);
        this.processLocal(resourceName, path.join(basePath, source), destDir, true, resourceDef.resource === "rule");
        break;
      }

      case "git": {
        if (!resourceDef.url) throw new Error("Git URL is required for git mode");
        await this.provisionGit(resourceDef, resourceDestDir, targetDir);
        break;
      }
    }
  }

  private async provisionRemote(resourceName: string, resourceDef: ResourceDefinition, targetDir: string, resourceDestDir: string): Promise<void> {
    console.log(chalk.gray(`    Fetching remote ${resourceDef.resource} document...`));
    const response = await fetch(resourceDef.url!);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const content = await response.text();
    
    const defaultFilename = resourceDef.resource === "rule" ? `${resourceName}.md` : "SKILL.md";
    const targetFile = resourceDef.path ? path.join(targetDir, resourceDef.path) : path.join(resourceDestDir, defaultFilename);
    
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, content, "utf-8");
    console.log(chalk.green(`    ✔️ Downloaded to ${path.relative(targetDir, targetFile)}`));
  }

  private async provisionGit(resourceDef: ResourceDefinition, resourceDestDir: string, targetDir: string): Promise<void> {
    console.log(chalk.gray(`    Provisioning via Git (${resourceDef.url}${resourceDef.subpath ? ` / ${resourceDef.subpath}` : ""})...`));
    
    const isGitHub = resourceDef.url!.includes("github.com");
    if (isGitHub) {
      await this.provisionFromGitHub(resourceDef, resourceDestDir);
    } else {
      this.provisionViaClone(resourceDef, resourceDestDir, targetDir);
    }
  }

  private async provisionFromGitHub(resourceDef: ResourceDefinition, destDir: string): Promise<void> {
    const urlParts = resourceDef.url!.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1].replace(".git", "");
    const branch = resourceDef.branch || "main";
    const subpath = resourceDef.subpath || "";

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${subpath}?ref=${branch}`;
    
    await this.fetchGitHubDirectory(apiUrl, destDir);
    console.log(chalk.green(`    ✔️ Git structure provisioned successfully`));
  }

  private async fetchGitHubDirectory(apiUrl: string, destDir: string): Promise<void> {
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "antigravity-cli"
      }
    });

    if (!response.ok) {
      if (response.status === 403) throw new Error("GitHub API rate limit exceeded.");
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const items = (await response.json()) as any[];

    for (const item of items) {
      const itemDest = path.join(destDir, item.name);
      if (item.type === "file") {
        const fileRes = await fetch(item.download_url);
        const content = await fileRes.text();
        fs.writeFileSync(itemDest, content, "utf-8");
      } else if (item.type === "dir") {
        if (!fs.existsSync(itemDest)) fs.mkdirSync(itemDest, { recursive: true });
        await this.fetchGitHubDirectory(item.url, itemDest);
      }
    }
  }

  private provisionViaClone(resourceDef: ResourceDefinition, destDir: string, targetDir: string): void {
    const tempDir = path.join(targetDir, `.sdd-temp-${resourceDef.resource}`);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    
    try {
      const branchFlag = resourceDef.branch ? `-b ${resourceDef.branch}` : "";
      const cloneCmd = ["git clone --depth 1", branchFlag, resourceDef.url, tempDir].filter(Boolean).join(" ");
      execSync(cloneCmd, { stdio: "ignore" });
      
      const sourceDir = resourceDef.subpath ? path.join(tempDir, resourceDef.subpath) : tempDir;
      if (fs.existsSync(sourceDir)) {
        fs.cpSync(sourceDir, destDir, { recursive: true, force: true });
        console.log(chalk.green(`    ✔️ Git structure provisioned via clone`));
      } else {
        throw new Error(`Subpath ${resourceDef.subpath} not found in repository`);
      }
    } finally {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private processLocal(resourceName: string, sourceBasePath: string, destDir: string, isAbsolutePath = false, isFile = false) {
    const resourceSource = isAbsolutePath ? sourceBasePath : path.join(sourceBasePath, "skills", resourceName);
    const resourceDest = isFile ? path.join(destDir, `${resourceName}.md`) : path.join(destDir, resourceName);

    if (fs.existsSync(resourceSource)) {
      try {
         fs.cpSync(resourceSource, resourceDest, { recursive: true, force: true });
         console.log(chalk.green(`    ✔️ Local resource injected`));
      } catch (copyErr) {
         console.warn(chalk.yellow(`    ⚠️ Failed to copy local resource: ${resourceName}`));
      }
    } else {
      console.warn(chalk.yellow(`    ⚠️ Resource not found locally at ${resourceSource}`));
    }
  }
}
