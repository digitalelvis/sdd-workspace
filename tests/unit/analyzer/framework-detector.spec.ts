import fs from "fs";
import { detectFramework } from "../../../src/analyzer/framework-detector";
import { SupportedStack } from "../../../src/domain/enums/SupportedStack";

jest.mock("fs");

describe("Analyzer - Framework Detector", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return NODEJS if package.json does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const stacks = detectFramework("/fake/dir");
    expect(stacks).toEqual([SupportedStack.NODEJS]);
  });

  it("should detect React and NodeJS if 'react' is in dependencies", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ dependencies: { react: "^18.0.0" } })
    );

    const stacks = detectFramework("/fake/dir");
    expect(stacks).toContain(SupportedStack.REACT);
    expect(stacks).toContain(SupportedStack.NODEJS);
    expect(stacks.length).toBe(2);
  });

  it("should detect NextJS, React, and NodeJS when 'next' is in dependencies", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ dependencies: { next: "14.0.0" } })
    );

    const stacks = detectFramework("/fake/dir");
    expect(stacks).toContain(SupportedStack.NEXTJS);
    expect(stacks).toContain(SupportedStack.REACT);
    expect(stacks).toContain(SupportedStack.NODEJS);
    expect(stacks.length).toBe(3);
  });

  it("should detect Python when requirements.txt exists", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("requirements.txt"));
    
    const stacks = detectFramework("/fake/dir");
    expect(stacks).toContain(SupportedStack.PYTHON);
  });

  it("should detect Laravel and PHP when composer.json and artisan exist", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => 
      p.endsWith("composer.json") || p.endsWith("artisan")
    );
    
    const stacks = detectFramework("/fake/dir");
    expect(stacks).toContain(SupportedStack.PHP);
    expect(stacks).toContain(SupportedStack.LARAVEL);
  });

  it("should safely fallback to NODEJS when package.json parsing fails", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => p.endsWith("package.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue("{ invalid_json }");

    const stacks = detectFramework("/fake/dir");
    expect(stacks).toEqual([SupportedStack.NODEJS]);
  });
});

