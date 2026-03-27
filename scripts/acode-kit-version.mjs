import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionFile = path.resolve(__dirname, "..", "VERSION");

export const ACODE_KIT_VERSION = fs.readFileSync(versionFile, "utf8").trim();
