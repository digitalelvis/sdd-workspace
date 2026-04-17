import fs from "fs";
import path from "path";
import { CursorAgentProvider } from "../../../src/scaffolder/providers/agents/CursorAgentProvider";
import { WindsurfAgentProvider } from "../../../src/scaffolder/providers/agents/WindsurfAgentProvider";
import { AntigravityAgentProvider } from "../../../src/scaffolder/providers/agents/AntigravityAgentProvider";
import { CopilotAgentProvider } from "../../../src/scaffolder/providers/agents/CopilotAgentProvider";
import { KiroAgentProvider } from "../../../src/scaffolder/providers/agents/KiroAgentProvider";

jest.mock("fs");

describe("AgentProviders - Rule Injection Formatting", () => {
  const targetDir = "/mocked/target";
  const mainRule = "MAIN_RULE";
  const stackRule = "STACK_RULE";
  const rawExpectedContent = `${mainRule}\n\n${stackRule}`;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation();
  });

  it("should generate the correct root `.cursorrules` for Cursor", () => {
    const provider = new CursorAgentProvider();
    provider.injectRules(targetDir, mainRule, stackRule);
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(targetDir, ".cursorrules"),
      rawExpectedContent
    );
  });

  it("should generate the correct root `.windsurfrules` for Windsurf", () => {
    const provider = new WindsurfAgentProvider();
    provider.injectRules(targetDir, mainRule, stackRule);
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(targetDir, ".windsurfrules"),
      rawExpectedContent
    );
  });

  it("should generate the correct root `.kirorules` for Kiro", () => {
    const provider = new KiroAgentProvider();
    provider.injectRules(targetDir, mainRule, stackRule);
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(targetDir, ".kirorules"),
      rawExpectedContent
    );
  });

  it("should securely create directory and file `.github/copilot-instructions.md` for Copilot", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    const provider = new CopilotAgentProvider();
    provider.injectRules(targetDir, mainRule, stackRule);

    const expectedDir = path.join(targetDir, ".github");
    expect(fs.mkdirSync).toHaveBeenCalledWith(expectedDir, { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(expectedDir, "copilot-instructions.md"),
      rawExpectedContent
    );
  });

  it("should securely create directory and file `.agent/rules/rule.md` for Antigravity", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    const provider = new AntigravityAgentProvider();
    provider.injectRules(targetDir, mainRule, stackRule);

    const expectedDir = path.join(targetDir, ".agent", "rules");
    expect(fs.mkdirSync).toHaveBeenCalledWith(expectedDir, { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(expectedDir, "rule.md"),
      rawExpectedContent
    );
  });
});
