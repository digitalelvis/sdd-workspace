import fs from "fs";
import { ExistenceChecker } from "../../../src/utils/ExistenceChecker";
import { RegistryLoader } from "../../../src/resources/RegistryLoader";

jest.mock("fs");
jest.mock("../../../src/resources/RegistryLoader");

describe("ExistenceChecker", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (RegistryLoader.load as jest.Mock).mockReturnValue({
      tools: {
        eslint: {
          configFiles: [".eslintrc.json", "eslint.config.js"],
          dependencies: ["eslint"],
        },
        husky: {
          configFiles: [".husky"],
          dependencies: ["husky"],
        },
        zod: {
          configFiles: [],
          dependencies: ["zod"],
        }
      }
    });
  });

  it("should return false if tool is not in registry", () => {
    expect(ExistenceChecker.isAlreadyInstalled("unknown", "/test")).toBe(false);
  });

  it("should return true if a config file exists", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => p.endsWith(".eslintrc.json"));
    
    expect(ExistenceChecker.isAlreadyInstalled("eslint", "/test")).toBe(true);
  });

  it("should return true if the dependency is in package.json", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      devDependencies: { eslint: "^8.0.0" }
    }));

    expect(ExistenceChecker.isAlreadyInstalled("eslint", "/test")).toBe(true);
  });

  it("should return false if neither config nor dependencies are found", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(ExistenceChecker.isAlreadyInstalled("eslint", "/test")).toBe(false);
  });

  it("should handle tools with only dependencies (e.g. zod)", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      dependencies: { zod: "^3.0.0" }
    }));

    expect(ExistenceChecker.isAlreadyInstalled("zod", "/test")).toBe(true);
  });

  it("should handle package.json parse errors gracefully", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue("invalid json");

    expect(ExistenceChecker.isAlreadyInstalled("eslint", "/test")).toBe(false);
  });
});
