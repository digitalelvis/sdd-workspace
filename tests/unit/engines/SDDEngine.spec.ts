import fs from "fs";
import path from "path";
import { SDDEngine } from "../../../src/scaffolder/engines/SDDEngine";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { NodeStackProvider } from "../../../src/scaffolder/providers/stacks/NodeStackProvider";

jest.mock("fs");

describe("SDDEngine - Core SDD Capabilities Injection", () => {
  let sddEngine: SDDEngine;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest.spyOn(console, "log").mockImplementation();
    stderrSpy = jest.spyOn(console, "error").mockImplementation();
    sddEngine = new SDDEngine();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it("should throw an error if the common-rules.md file is completely missing", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false); // Disables finding common-rules.md

    expect(() => {
      sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR]);
    }).toThrow("common-rules.md not found");
  });

  it("should successfully mount the rule string and sideload skills into .agents/skills", () => {
    // 1st existsSync is common-rules.md, 2nd is stack rule, 3rd is dest skill dir, 4th+ are individual skills
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("Mocked Rule Text");
    (fs.cpSync as jest.Mock).mockImplementation(() => {});
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

    // Using NodeStackProvider, which gives ['tlc-spec-driven', 'nodejs-best-practices', 'nodejs-backend-patterns']
    const provider = new NodeStackProvider();
    
    // We execute cursor to confirm the rules go down cleanly
    sddEngine.inject("/target/dir", [provider], [AiAgent.CURSOR]);

    // Check if Cursor Provider was hooked properly (since we mocked writeFileSync in its core we just check it fired)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".cursorrules"),
      expect.stringContaining("Mocked Rule Text")
    );

    // Verify Skills were copied
    expect(fs.cpSync).toHaveBeenCalledTimes(3); 
    expect(fs.cpSync).toHaveBeenCalledWith(
      expect.stringContaining("tlc-spec-driven"),
      expect.stringContaining(path.join(".agents", "skills", "tlc-spec-driven")),
      expect.anything()
    );
  });
});
