import fs from "fs";
import path from "path";
import { detectDatabase } from "../../../src/analyzer/DatabaseDetector";
import { SupportedDatabase } from "../../../src/domain/enums/SupportedDatabase";

jest.mock("fs");

describe("DatabaseDetector", () => {
  const mockRegistry = {
    postgres: {
      displayName: "PostgreSQL",
      detectionDeps: ["pg", "postgres"],
      detectionFiles: ["prisma/schema.prisma"]
    },
    mongodb: {
      displayName: "MongoDB",
      detectionDeps: ["mongodb", "mongoose"]
    }
  };

  const targetDir = "/test/project";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should detect database via dependencies", () => {
    const pkgContent = JSON.stringify({
      dependencies: {
        pg: "8.11.0"
      }
    });

    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(pkgContent);

    const result = detectDatabase(targetDir, mockRegistry as any);

    expect(result).toContain(SupportedDatabase.POSTGRES);
    expect(result).not.toContain(SupportedDatabase.MONGODB);
  });

  it("should detect database via files", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("prisma/schema.prisma") || p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));

    const result = detectDatabase(targetDir, mockRegistry as any);

    expect(result).toContain(SupportedDatabase.POSTGRES);
  });

  it("should return empty array if no database is detected", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));

    const result = detectDatabase(targetDir, mockRegistry as any);

    expect(result).toEqual([]);
  });

  it("should handle invalid package.json gracefully", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue("invalid json");

    const result = detectDatabase(targetDir, mockRegistry as any);

    expect(result).toEqual([]);
  });
});
