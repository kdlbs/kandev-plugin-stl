import { build } from "esbuild";
await build({
  entryPoints: ["src/index.js", "src/worker.js"],
  outdir: "ui",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  entryNames: "[name]",
});
