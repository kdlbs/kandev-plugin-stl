import { parseSTL } from "./parser.js";
self.onmessage = (event) => {
  try {
    const result = parseSTL(event.data);
    self.postMessage(result, [result.positions.buffer]);
  } catch (error) {
    self.postMessage({
      error: error?.message === "stl_limit" ? "limit" : "invalid",
    });
  }
};
