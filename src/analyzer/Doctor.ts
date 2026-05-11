import fs from "fs";
import path from "path";
import { ConfigResolver } from "../config/ConfigResolver";
import { LOCAL_CONFIG_FILENAME } from "../config/defaults";
import {
  ResourceDefinition,
  SkillRegistryCatalog,
} from "../domain/contracts/SkillRegistry";
import { RegistryLoader } from "../resources/RegistryLoader";

export interface DoctorLine {
  level: "ok" | "warn" | "error";
  message: string;
}

export interface DoctorResult {
  lines: DoctorLine[];
  exitCode: number;
}

/**
 * Read-only validation: resolved workspace config vs materialized `.agents` tree.
 * Validates both skills and rules, based on existing ConfigResolver + registry.
 */
export class Doctor {
  public static run(targetDir: string): DoctorResult {
    const lines: DoctorLine[] = [];
    const resolver = new ConfigResolver();
    const local = resolver.loadLocalConfig(targetDir);

    if (!local) {
      lines.push({
        level: "error",
        message: `No ${LOCAL_CONFIG_FILENAME} found — run "sdd init" first.`,
      });
      return { lines, exitCode: 1 };
    }

    const resolved = resolver.resolve(
      {
        agents: local.agents,
        ide: local.ide,
        lint: local.lint,
        stacks: local.stacks,
        database: local.database,
        gitStrategy: local.gitStrategy,
      },
      targetDir,
    );
    const registry = RegistryLoader.load();

    const skills = resolved.skills?.include ?? [];
    const ruleIds = this.getExpectedRuleIds(
      resolved.stacks ?? [],
      resolved.database ?? [],
      resolved.gitStrategy,
      registry,
    );

    lines.push({
      level: "ok",
      message: `Loaded ${LOCAL_CONFIG_FILENAME} — ${skills.length} resolved skill(s), ${ruleIds.length} expected rule(s).`,
    });

    if (!fs.existsSync(path.join(targetDir, ".specs"))) {
      lines.push({
        level: "warn",
        message:
          "`.specs/` is missing — workspace may be incomplete (run `sdd init` or `sdd apply`).",
      });
    }

    let hasError = false;

    const skillsRoot = path.join(targetDir, ".agents", "skills");
    if (!fs.existsSync(skillsRoot)) {
      lines.push({
        level: "warn",
        message:
          "`.agents/skills/` is missing — no skills have been materialized yet (run `sdd apply`).",
      });
    }
    hasError =
      this.validateSkills(skills, registry, skillsRoot, lines) || hasError;

    const rulesRoot = path.join(targetDir, ".agents", "rules");
    if (!fs.existsSync(rulesRoot)) {
      lines.push({
        level: "warn",
        message:
          "`.agents/rules/` is missing — no rules have been materialized yet (run `sdd apply`).",
      });
    }
    hasError =
      this.validateRules(ruleIds, registry, rulesRoot, lines) || hasError;

    return { lines, exitCode: hasError ? 1 : 0 };
  }

  private static validateSkills(
    skillIds: string[],
    registry: SkillRegistryCatalog,
    skillsRoot: string,
    lines: DoctorLine[],
  ): boolean {
    let hasError = false;

    for (const skillId of skillIds) {
      const def: ResourceDefinition | undefined = registry.skills[skillId];
      if (def?.mode === "cli") {
        lines.push({
          level: "warn",
          message: `Skill "${skillId}" uses CLI install mode — verify manually (on-disk check skipped).`,
        });
        continue;
      }

      const skillDir = path.join(skillsRoot, skillId);
      if (!fs.existsSync(skillDir)) {
        lines.push({
          level: "error",
          message: `Missing skill directory: .agents/skills/${skillId}/ — run \`sdd apply\`.`,
        });
        hasError = true;
        continue;
      }

      if (!this.dirHasContent(skillDir)) {
        lines.push({
          level: "error",
          message: `Skill directory is empty: .agents/skills/${skillId}/ — run \`sdd apply\`.`,
        });
        hasError = true;
        continue;
      }

      lines.push({
        level: "ok",
        message: `Skill "${skillId}" present under .agents/skills/${skillId}/`,
      });
    }

    if (skillIds.length === 0) {
      lines.push({
        level: "warn",
        message:
          "No skills in resolved config (stacks + include may be empty).",
      });
    }

    return hasError;
  }

  private static validateRules(
    ruleIds: string[],
    registry: SkillRegistryCatalog,
    rulesRoot: string,
    lines: DoctorLine[],
  ): boolean {
    let hasError = false;

    for (const ruleId of ruleIds) {
      const def: ResourceDefinition | undefined = registry.rules[ruleId];
      if (def?.mode === "cli") {
        lines.push({
          level: "warn",
          message: `Rule "${ruleId}" uses CLI install mode — verify manually (on-disk check skipped).`,
        });
        continue;
      }

      const ruleFile = path.join(rulesRoot, `${ruleId}.md`);
      if (!fs.existsSync(ruleFile)) {
        lines.push({
          level: "error",
          message: `Missing rule file: .agents/rules/${ruleId}.md — run \`sdd apply\`.`,
        });
        hasError = true;
        continue;
      }

      const content = fs.readFileSync(ruleFile, "utf-8").trim();
      if (!content) {
        lines.push({
          level: "error",
          message: `Rule file is empty: .agents/rules/${ruleId}.md — run \`sdd apply\`.`,
        });
        hasError = true;
        continue;
      }

      lines.push({
        level: "ok",
        message: `Rule "${ruleId}" present under .agents/rules/${ruleId}.md`,
      });
    }

    const mainRule = path.join(rulesRoot, "main.md");
    if (!fs.existsSync(mainRule)) {
      lines.push({
        level: "error",
        message:
          "Missing centralized rules file: .agents/rules/main.md — run `sdd apply`.",
      });
      hasError = true;
    }

    return hasError;
  }

  private static getExpectedRuleIds(
    stacks: string[],
    databases: string[],
    gitStrategy: string | undefined,
    registry: SkillRegistryCatalog,
  ): string[] {
    const ids = new Set<string>(["engineering-rules"]);

    for (const stack of stacks) {
      const stackDef = registry.stacks[stack];
      stackDef?.defaultRules?.forEach((ruleId) => ids.add(ruleId));
    }

    for (const db of databases) {
      const dbDef = registry.databases[db];
      dbDef?.defaultRules?.forEach((ruleId) => ids.add(ruleId));
    }

    if (gitStrategy && registry.gitStrategies?.[gitStrategy]) {
      registry.gitStrategies[gitStrategy].defaultRules?.forEach((ruleId) =>
        ids.add(ruleId),
      );
    }

    return Array.from(ids);
  }

  private static dirHasContent(dir: string): boolean {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile()) return true;
      if (e.isDirectory() && this.dirHasContent(path.join(dir, e.name)))
        return true;
    }
    return false;
  }
}
