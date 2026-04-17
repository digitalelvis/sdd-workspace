import fs from "fs";
import { WorkspaceService } from "../../../src/scaffolder/WorkspaceService";
import { SupportedStack } from "../../../src/domain/enums/SupportedStack";

jest.mock("fs");

describe("Scaffolder - WorkspaceService", () => {
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(console, "log").mockImplementation();
    stderrSpy = jest.spyOn(console, "error").mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it("should orchestrate without crashing for a basic node stack", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("mocked-content");
    
    // We mock cpSync and writeFileSync to prevent real disk operations
    (fs.cpSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const orchestrator = new WorkspaceService();
    
    expect(() => {
      orchestrator.execute("/fake/dir", [SupportedStack.NODEJS], undefined, [], { skipLint: true });
    }).not.toThrow();
  });

});
