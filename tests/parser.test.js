import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSTL } from "../src/parser.js";
const ascii =
  "solid part\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 10 0 0\nvertex 0 20 0\nendloop\nendfacet\nendsolid part";
const bytes = (text) => new TextEncoder().encode(text).buffer;
function binary(count = 1) {
  const b = new ArrayBuffer(84 + count * 50);
  const v = new DataView(b);
  v.setUint32(80, count, true);
  if (count) {
    v.setFloat32(84 + 8, 1, true);
    v.setFloat32(84 + 24, 10, true);
    v.setFloat32(84 + 40, 20, true);
  }
  return b;
}
test("ASCII and binary preserve original dimensions", () => {
  for (const b of [bytes(ascii), binary()]) {
    const parsed = parseSTL(b);
    assert.equal(parsed.positions.length, 9);
    assert.deepEqual(parsed.bounds, [0, 0, 0, 10, 20, 0]);
  }
});
test("binary solid prefix does not imply ASCII", () => {
  const b = binary();
  new Uint8Array(b).set(new TextEncoder().encode("solid misleading"));
  assert.equal(parseSTL(b).positions.length, 9);
});
test("malformed data and excessive allocations are refused", () => {
  for (const b of [
    new ArrayBuffer(0),
    bytes(ascii.replace("20", "NaN")),
    bytes(ascii.replace("endfacet", "")),
    binary().slice(0, 100),
    bytes("solid\nendsolid"),
    bytes(ascii.replace("10", "1".repeat(1000))),
  ])
    assert.throws(() => parseSTL(b));
  const huge = new ArrayBuffer(84);
  new DataView(huge).setUint32(80, 1000001, true);
  assert.throws(() => parseSTL(huge));
  const b = binary();
  new DataView(b).setFloat32(96, Infinity, true);
  assert.throws(() => parseSTL(b));
});
test("ASCII names are inert and multiple solids parse", () => {
  const result = parseSTL(
    bytes(ascii.replaceAll("part", "<script>") + "\n" + ascii),
  );
  assert.equal(result.positions.length, 18);
});
test("resource-limit failures have a separate fixed error code", () => {
  assert.throws(() => parseSTL(new ArrayBuffer(64 * 1024 * 1024 + 1)), {
    message: "stl_limit",
  });
  assert.throws(() => parseSTL(binary(1_000_001)), { message: "stl_limit" });
});
test('zero-extent geometry is rejected before rendering',()=>{
 const model=new ArrayBuffer(134);new DataView(model).setUint32(80,1,true);
 assert.throws(()=>parseSTL(model),{message:'invalid_stl'});
});
