import assert from "node:assert/strict";
import path from "node:path";
export function modelBytes() {
  const data = new Uint8Array(84 + 50);
  const view = new DataView(data.buffer);
  view.setUint32(80, 1, true);
  view.setFloat32(84 + 8, 1, true);
  view.setFloat32(84 + 24, 10, true);
  view.setFloat32(84 + 40, 20, true);
  return data;
}
export async function verifyViewer(page, mobile) {
  // Canvas is focusable and labelled but does not claim a static-image role.
  const viewport = page.locator(".stl-viewport canvas");
  await viewport.waitFor({ state: "visible", timeout: 20000 });
  const dimensions = page.locator(".stl-dimensions");
  assert.equal(await dimensions.textContent(), "X 10 × Y 20 × Z 0 model units");
  const initial = await viewport.screenshot();
  if (mobile) {
    const cdp = await page.context().newCDPSession(page);
    const box = await viewport.boundingBox();
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x + 50, y: y + 25 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { x: x - 30, y },
        { x: x + 30, y },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: x - 55, y: y + 15 },
        { x: x + 55, y: y + 15 },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.detach();
  } else {
    const box = await viewport.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + 70,
      box.y + box.height / 2 + 35,
      { steps: 10 },
    );
    await page.mouse.up();
    await viewport.focus();
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("+");
  }
  assert.notDeepEqual(await viewport.screenshot(), initial);
  assert.equal(await dimensions.textContent(), "X 10 × Y 20 × Z 0 model units");
  await page.getByRole("button", { name: "Fit", exact: true }).click();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  assert.equal(await dimensions.textContent(), "X 10 × Y 20 × Z 0 model units");
  assert.equal(await page.locator(".stl-viewer select").count(), 0);
  for (const text of [
    "Units are assumed. STL does not store units.",
    "Dimensions describe the bounding box. The 3D shape has no complete text equivalent.",
  ]) {
    assert.equal(await page.getByText(text, { exact: true }).count(), 0);
  }
  if (mobile) {
    for (const item of await page
      .locator(".stl-actions button")
      .all()) {
      const b = await item.boundingBox();
      assert.ok(b.height >= 44 && b.width >= 44);
    }
  }
  await page.screenshot({
    path: path.join(
      process.env.KANDEV_STL_TEST_OUTPUT,
      `stl-${mobile ? "phone" : "desktop"}.png`,
    ),
  });
  await viewport.evaluate((canvas) =>
    canvas
      .getContext("webgl2")
      .getExtension("WEBGL_lose_context")
      .loseContext(),
  );
  await page
    .getByText(
      "3D graphics are unavailable or the graphics context was lost. Close this preview and try again.",
      { exact: true },
    )
    .waitFor();
}
