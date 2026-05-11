import fs from "fs";
import os from "os";
import path from "path";
import { Doctor } from "../../../src/analyzer/Doctor";

describe("Doctor", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "doctor-"));
  });

  function writeMinimalSddYml(skillIncludes: string[]): void {
    const yml = [
      "version: 0.1.3",
      "stacks:",
      "  - nodejs",
      "agents:",
      "  - cursor",
      "ide: cursor",
      "lint: true",
      "database: []",
      "security: []",
      "skills:",
      "  include:",
      ...skillIncludes.map(s => `    - ${s}`),
      "  exclude: []",
      "",
    ].join("\n");
    fs.writeFileSync(path.join(tmpDir, "sdd.yml"), yml, "utf-8");
  }

  it("returns exitCode 1 when sdd.yml is missing", () => {
    const result = Doctor.run(tmpDir);
    expect(result.exitCode).toBe(1);
    expect(result.lines.some(l => l.level === "error" && l.message.includes("sdd.yml"))).toBe(true);
  });

  it("returns exitCode 1 when expected skill directory is missing", () => {
    writeMinimalSddYml(["spec-driven"]);
    const result = Doctor.run(tmpDir);
    expect(result.exitCode).toBe(1);
    expect(result.lines.some(l => l.message.includes(".agents/skills/spec-driven"))).toBe(true);
  });

  it("returns exitCode 1 when expected rule file is missing", () => {
    writeMinimalSddYml(["spec-driven"]);

    const skillDir = path.join(tmpDir, ".agents", "skills", "spec-driven");
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# ok\n", "utf-8");

    const result = Doctor.run(tmpDir);
    expect(result.exitCode).toBe(1);
    expect(result.lines.some(l => l.message.includes(".agents/rules/engineering-rules.md"))).toBe(true);
  });

  it("returns exitCode 0 when resolved skills and rules are present", () => {
    writeMinimalSddYml(["spec-driven"]);

    const skillDir = path.join(tmpDir, ".agents", "skills", "spec-driven");
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# ok\n", "utf-8");

    const rulesDir = path.join(tmpDir, ".agents", "rules");
    fs.mkdirSync(rulesDir, { recursive: true });
    fs.writeFileSync(path.join(rulesDir, "engineering-rules.md"), "# engineering\n", "utf-8");
    fs.writeFileSync(path.join(rulesDir, "node-rules.md"), "# node\n", "utf-8");
    fs.writeFileSync(path.join(rulesDir, "main.md"), "# main\n", "utf-8");

    const result = Doctor.run(tmpDir);
    expect(result.exitCode).toBe(0);
    expect(result.lines.some(l => l.level === "ok" && l.message.includes("spec-driven"))).toBe(true);
    expect(result.lines.some(l => l.level === "ok" && l.message.includes("engineering-rules"))).toBe(true);
    expect(result.lines.some(l => l.level === "ok" && l.message.includes("node-rules"))).toBe(true);
  });
});
