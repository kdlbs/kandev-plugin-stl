import { createScene } from "./scene.js";
import { translations } from "./translations.js";

window.registerKandevPlugin("kandev-plugin-stl", {
  initialize(registry, host) {
    if (typeof registry.registerFileViewer !== "function")
      throw Error("file_viewer_host_required");
    registry.registerTranslations(translations);
    const { createElement: h, useEffect, useRef, useState } = host.React;
    function Viewer({ file, readBytes }) {
      const { t } = host.i18n.useTranslation();
      const container = useRef(null),
        scene = useRef(null);
      const [status, setStatus] = useState("loading");
      const [model, setModel] = useState(null);
      useEffect(() => {
        const abort = new AbortController();
        let worker,
          timer,
          disposed = false;
        const cleanup = () => {
          clearTimeout(timer);
          worker?.terminate();
          scene.current?.dispose();
          scene.current = null;
        };
        const fail = (reason = "failed") => {
          if (!disposed) {
            cleanup();
            setStatus(typeof reason === "string" ? reason : "failed");
          }
        };
        void readBytes(abort.signal)
          .then((bytes) => {
            if (disposed) return;
            worker = new Worker(
              new URL(
                "/api/plugins/kandev-plugin-stl/ui/ui/worker.js",
                import.meta.url,
              ),
              { type: "module" },
            );
            timer = setTimeout(() => fail("timeout"), 10000);
            worker.onerror = () => fail("failed");
            worker.onmessage = (event) => {
              clearTimeout(timer);
              worker.terminate();
              if (disposed || !container.current) return;
              if (event.data.error) {
                fail(event.data.error);
                return;
              }
              try {
                scene.current = createScene(container.current, event.data, () =>
                  fail("gpu"),
                );
                scene.current.canvas.setAttribute("aria-label", t("viewport"));
                setModel({
                  dimensions: scene.current.dimensions,
                  spacing: scene.current.spacing,
                });
                setStatus("ready");
              } catch {
                fail("gpu");
              }
            };
            worker.postMessage(bytes, [bytes]);
          })
          .catch(fail);
        return () => {
          disposed = true;
          abort.abort();
          cleanup();
        };
      }, [file.generation]);
      const number = (value) =>
        new Intl.NumberFormat(undefined, {
          maximumSignificantDigits: 5,
        }).format(value);
      const unitLabel = t("model");
      const action = (label, run) =>
        h(host.ui.Button, { variant: "outline", onClick: run }, t(label));
      return h(
        "section",
        { className: "stl-viewer" },
        h(
          "div",
          {
            className: "stl-status",
            role:
              status === "ready" || status === "loading" ? "status" : "alert",
          },
          status === "ready" ? t("instructions") : t(status),
        ),
        h("div", { ref: container, className: "stl-viewport" }),
        model &&
          status === "ready" &&
          h(
            "div",
            { className: "stl-controls" },
            h(
              "p",
              { className: "stl-dimensions" },
              t("dimensions", {
                values: {
                  x: number(model.dimensions[0]),
                  y: number(model.dimensions[1]),
                  z: number(model.dimensions[2]),
                  unit: unitLabel,
                },
              }),
            ),
            h(
              "p",
              null,
              t("spacing", {
                values: { value: number(model.spacing), unit: unitLabel },
              }),
            ),
            h(
              "div",
              { className: "stl-actions" },
              action("fit", () => scene.current?.fit()),
              action("zoomIn", () => scene.current?.zoomIn()),
              action("zoomOut", () => scene.current?.zoomOut()),
            ),
          ),
      );
    }
    registry.registerFileViewer({ id: "stl", Component: Viewer });
  },
});
