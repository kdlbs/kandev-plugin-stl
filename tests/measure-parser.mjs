import { performance } from "node:perf_hooks";
import { spawnSync } from "node:child_process";
import { parseSTL, MAX_TRIANGLES, MAX_ACCOUNTED_BYTES } from "../src/parser.js";
if (!process.argv[2]) {
  for (const name of ["binary", "ascii"]) {
    const child = spawnSync(
      process.execPath,
      ["--expose-gc", import.meta.filename, name],
      { stdio: "inherit" },
    );
    if (child.status !== 0) process.exitCode = child.status ?? 1;
  }
} else {
  let buffer;
  if (process.argv[2] === "binary") {
    buffer = new ArrayBuffer(84 + MAX_TRIANGLES * 50);
    const view = new DataView(buffer);
    view.setUint32(80, MAX_TRIANGLES, true);
    for (let i = 0; i < MAX_TRIANGLES; i++) {
      view.setFloat32(84 + i * 50 + 24, 1, true);
      view.setFloat32(84 + i * 50 + 40, 1, true);
    }
  } else {
    const facet =
      "facet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 1 0 0\nvertex 0 1 0\nendloop\nendfacet\n";
    const count = Math.floor((64 * 1024 * 1024 - 32) / facet.length);
    buffer = new TextEncoder().encode(
      "solid model\n" + facet.repeat(count) + "endsolid model\n",
    ).buffer;
  }
  global.gc?.();
  const before = process.memoryUsage();
  const start = performance.now();
  const result = parseSTL(buffer);
  const after = process.memoryUsage();
  const triangles = result.positions.length / 9;
  const accounted =
    buffer.byteLength + triangles * 9 * 4 * 5 + 16 * 1024 * 1024;
  if (accounted > MAX_ACCOUNTED_BYTES) throw Error("allocation_budget");
  console.log(
    JSON.stringify({
      case: process.argv[2],
      source_bytes: buffer.byteLength,
      triangles,
      elapsed_ms: Math.round(performance.now() - start),
      accounted_bytes: accounted,
      array_buffers_before_bytes: before.arrayBuffers,
      array_buffers_after_bytes: after.arrayBuffers,
      max_rss_kib: process.resourceUsage().maxRSS,
    }),
  );
}
