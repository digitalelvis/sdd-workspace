import fs from "fs";
import { WorkflowComposer } from "../../../src/scaffolder/engines/WorkflowComposer";

jest.mock("fs");

describe("WorkflowComposer", () => {
  let composer: WorkflowComposer;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation();
    composer = new WorkflowComposer();
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should generate a workflow file if it does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    composer.compose("/mock/dir", {
      lint: true,
      resolvedTools: {
        "eslint": { type: "lint", displayName: "ESLint", dependencies: [], configFiles: [] },
        "jest": { type: "test", displayName: "Jest", dependencies: [], configFiles: [] }
      }
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("ci-sdd.yml"),
      expect.stringContaining("name: CI/CD Pipeline"),
      "utf-8"
    );

    // Should include lint and test steps
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("ci-sdd.yml"),
      expect.stringContaining("npm run lint"),
      "utf-8"
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("ci-sdd.yml"),
      expect.stringContaining("npm test"),
      "utf-8"
    );
  });

  it("should not overwrite if the file already exists", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    composer.compose("/mock/dir", {});

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("already exists. Skipping generation."));
  });
});
