"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = detectFramework;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SupportedStack_1 = require("../domain/enums/SupportedStack");
function detectFramework(targetDir) {
    const pkgPath = path_1.default.join(targetDir, "package.json");
    const detectedStacks = [];
    if (!fs_1.default.existsSync(pkgPath)) {
        detectedStacks.push(SupportedStack_1.SupportedStack.NODEJS);
        return detectedStacks;
    }
    try {
        const pkgData = fs_1.default.readFileSync(pkgPath, "utf-8");
        const pkg = JSON.parse(pkgData);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps["next"]) {
            detectedStacks.push(SupportedStack_1.SupportedStack.NEXTJS);
            detectedStacks.push(SupportedStack_1.SupportedStack.REACT);
        }
        else if (deps["react"]) {
            detectedStacks.push(SupportedStack_1.SupportedStack.REACT);
        }
        // Always attach NodeJS as base if we have package.json for now
        detectedStacks.push(SupportedStack_1.SupportedStack.NODEJS);
    }
    catch (e) {
        console.warn("⚠️ Could not parse package.json, defaulting to Node.js.");
        detectedStacks.push(SupportedStack_1.SupportedStack.NODEJS);
    }
    // Ensure unique elements in case logic overlaps
    return Array.from(new Set(detectedStacks));
}
