import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = process.env.KANDEV_HOST_SOURCE;
if (!host)
  throw Error(
    "Set KANDEV_HOST_SOURCE to the compatible Kandev source checkout.",
  );
const web = path.join(host, "apps/web");
const packageFile = execFileSync("make", ["--no-print-directory", "-s", "package-file"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const archivePath = path.join(root, packageFile);
if (!fs.existsSync(archivePath))
  throw Error("Run make package-host before the host smoke test.");
fs.mkdirSync(path.join(root, ".build"), { recursive: true });
const dir = fs.mkdtempSync(path.join(web, "e2e/tests/stl-package-"));
const quote = JSON.stringify;
try {
  for (const [project, mobile] of [
    ["chromium", false],
    ["mobile-chrome", true],
  ]) {
    const file = path.join(dir, mobile ? "mobile-stl.spec.ts" : "stl.spec.ts");
    fs.writeFileSync(
      file,
      `import {test} from '../..//fixtures/test-base';\nimport {fileViewerFlow} from '../plugins/file-viewer-flow';\nimport {modelBytes,verifyViewer} from ${quote(path.join(root, "e2e/stl-viewer.mjs"))};\ntest('installed STL package renders and handles input',async ({testPage,apiClient,seedData,backend})=>{test.setTimeout(120000);await fileViewerFlow({testPage,apiClient,seedData,backend,mobile:${mobile},viewer:{archivePath:${quote(archivePath)},id:'kandev-plugin-stl',bytes:modelBytes(),verify:verifyViewer}})});\n`,
    );
    const result = spawnSync(
      "pnpm",
      [
        "e2e:run",
        "--host",
        "--no-build",
        "--shards",
        "1",
        "--project",
        project,
        path.relative(path.join(web, "e2e"), file),
      ],
      {
        cwd: web,
        env: {
          ...process.env,
          KANDEV_STL_TEST_OUTPUT: path.join(root, ".build"),
        },
        stdio: "inherit",
      },
    );
    if (result.status !== 0) process.exitCode = result.status ?? 1;
  }
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
