"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = detectFramework;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SupportedFramework_1 = require("../domain/enums/SupportedFramework");
function detectFramework(targetDir) {
    const pkgPath = path_1.default.join(targetDir, 'package.json');
    if (!fs_1.default.existsSync(pkgPath)) {
        return SupportedFramework_1.SupportedFramework.NODEJS;
    }
    try {
        const pkgData = fs_1.default.readFileSync(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgData);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps['next']) {
            return SupportedFramework_1.SupportedFramework.NEXTJS;
        }
        else if (deps['react']) {
            return SupportedFramework_1.SupportedFramework.REACT;
        }
    }
    catch (e) {
        console.warn('⚠️ Could not parse package.json, defaulting to Node.js.');
    }
    return SupportedFramework_1.SupportedFramework.NODEJS;
}
