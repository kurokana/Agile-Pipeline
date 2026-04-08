import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const distDir = join(root, "dist");

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

cpSync(join(root, "index.html"), join(distDir, "index.html"));
cpSync(join(root, "src"), join(distDir, "src"), { recursive: true });

console.log("Build selesai: folder dist siap di-upload sebagai artifact.");
