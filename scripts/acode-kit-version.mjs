import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const candidateFiles = [
  path.resolve(__dirname, "..", "VERSION"),
  path.resolve(__dirname, "..", "..", "VERSION")
];

function resolveVersion() {
  for (const candidate of candidateFiles) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, "utf8").trim();
    }
  }
  return "unknown";
}

export const ACODE_KIT_VERSION = resolveVersion();
