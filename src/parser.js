import { STLLoader } from "three/addons/loaders/STLLoader.js";
export const MAX_BYTES = 64 * 1024 * 1024;
export const MAX_TRIANGLES = 1_000_000;
const invalid = () => new Error("invalid_stl");
const limit = () => new Error("stl_limit");
export const MAX_ACCOUNTED_BYTES = 256 * 1024 * 1024;
function checkAllocation(bytes, triangles) {
  if (bytes + triangles * 9 * 4 * 5 + 16 * 1024 * 1024 > MAX_ACCOUNTED_BYTES)
    throw limit();
}

export function parseSTL(buffer) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength === 0)
    throw invalid();
  if (buffer.byteLength > MAX_BYTES) throw limit();
  let positions;
  if (buffer.byteLength >= 84) {
    const view = new DataView(buffer);
    const count = view.getUint32(80, true);
    if (84 + count * 50 === buffer.byteLength) {
      if (count === 0) throw invalid();
      if (count > MAX_TRIANGLES) throw limit();
      checkAllocation(buffer.byteLength, count);
      for (let face = 0; face < count; face++)
        for (let offset = 0; offset < 48; offset += 4) {
          if (!Number.isFinite(view.getFloat32(84 + face * 50 + offset, true)))
            throw invalid();
        }
      const geometry = new STLLoader().parse(buffer);
      positions = geometry.getAttribute("position").array;
      geometry.dispose();
    }
  }
  if (!positions) {
    const input = new Uint8Array(buffer);
    const count = parseASCII(input);
    checkAllocation(buffer.byteLength, count);
    positions = new Float32Array(count * 9);
    parseASCII(input, positions);
  }
  const bounds = [
    Infinity,
    Infinity,
    Infinity,
    -Infinity,
    -Infinity,
    -Infinity,
  ];
  for (let i = 0; i < positions.length; i++) {
    const axis = i % 3;
    bounds[axis] = Math.min(bounds[axis], positions[i]);
    bounds[axis + 3] = Math.max(bounds[axis + 3], positions[i]);
  }
  if (!bounds.every(Number.isFinite) || Math.max(...bounds.slice(3).map((value,index)=>value-bounds[index]))<=0) throw invalid();
  return { positions, bounds };
}

function parseASCII(bytes, positions) {
  let cursor = 0,
    faces = 0,
    output = 0;
  const space = (value) => value === 32 || (value >= 9 && value <= 13);
  const skip = () => {
    while (cursor < bytes.length && space(bytes[cursor])) cursor++;
  };
  const token = () => {
    skip();
    let value = "";
    while (cursor < bytes.length && !space(bytes[cursor])) {
      if (value.length >= 64 || bytes[cursor] > 126 || bytes[cursor] < 33)
        throw invalid();
      value += String.fromCharCode(bytes[cursor++]);
    }
    return value;
  };
  const expect = (value) => {
    if (token() !== value) throw invalid();
  };
  const number = () => {
    const value = token();
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value))
      throw invalid();
    const result = Math.fround(Number(value));
    if (!Number.isFinite(result)) throw invalid();
    return result;
  };
  const name = () => {
    let count = 0;
    while (
      cursor < bytes.length &&
      bytes[cursor] !== 10 &&
      bytes[cursor] !== 13
    ) {
      if (++count > 1024 || bytes[cursor] < 32 || bytes[cursor] > 126)
        throw invalid();
      cursor++;
    }
  };
  skip();
  while (cursor < bytes.length) {
    expect("solid");
    name();
    for (;;) {
      const kind = token();
      if (kind === "endsolid") {
        name();
        break;
      }
      if (kind !== "facet") throw invalid();
      if (++faces > MAX_TRIANGLES) throw limit();
      expect("normal");
      number();
      number();
      number();
      expect("outer");
      expect("loop");
      for (let vertex = 0; vertex < 3; vertex++) {
        expect("vertex");
        for (let axis = 0; axis < 3; axis++) {
          const value = number();
          if (positions) positions[output] = value;
          output++;
        }
      }
      expect("endloop");
      expect("endfacet");
    }
    skip();
  }
  if (faces === 0) throw invalid();
  return faces;
}
