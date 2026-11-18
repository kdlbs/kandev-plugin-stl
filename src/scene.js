import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createScene(container, result, onLost) {
  if (
    !(result.positions instanceof Float32Array) ||
    result.positions.length === 0 ||
    result.positions.length % 9 ||
    result.positions.length > 9_000_000 ||
    !Array.isArray(result.bounds) ||
    result.bounds.length !== 6 ||
    !result.bounds.every(Number.isFinite)
  )
    throw Error("invalid_geometry");
  const dimensions = result.bounds.slice(3).map((v, i) => v - result.bounds[i]);
  const extent = Math.max(...dimensions);
  if (!dimensions.every((v) => Number.isFinite(v) && v >= 0) || extent <= 0)
    throw Error("invalid_geometry");
  const center = dimensions.map((v, i) => result.bounds[i] + v / 2);
  for (let i = 0; i < result.positions.length; i++) {
    if (!Number.isFinite(result.positions[i])) throw Error("invalid_geometry");
    result.positions[i] = (result.positions[i] - center[i % 3]) / extent;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(result.positions, 3),
  );
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    color: 0x70a5cb,
    roughness: 0.65,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch (error) {
    geometry.dispose();
    material.dispose();
    throw error;
  }
  renderer.setPixelRatio(1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x667788, 2.2));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(3, 5, 4);
  scene.add(light);
  const grid = new THREE.GridHelper(2, 20, 0x8796a4, 0x8796a4);
  grid.position.y = -dimensions[1] / extent / 2;
  scene.add(grid);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.1;
  controls.maxDistance = 20;
  controls.cursorStyle = "grab";
  const render = () => renderer.render(scene, camera);
  const fit = () => {
    const aspect = Math.max(camera.aspect, 0.1);
    const distance =
      0.9 /
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) /
      Math.min(aspect, 1);
    camera.position.set(distance * 0.7, distance * 0.5, distance);
    controls.target.set(0, 0, 0);
    controls.update();
    render();
  };
  const zoom = (factor) => {
    camera.position
      .sub(controls.target)
      .multiplyScalar(factor)
      .clampLength(controls.minDistance, controls.maxDistance)
      .add(controls.target);
    controls.update();
    render();
  };
  const key = (event) => {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoom(0.8);
    } else if (event.key === "-") {
      event.preventDefault();
      zoom(1.25);
    } else if (event.key === "Home") {
      event.preventDefault();
      fit();
    }
  };
  const lost = (event) => {
    event.preventDefault();
    onLost();
  };
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.addEventListener("keydown", key);
  canvas.addEventListener("webglcontextlost", lost);
  controls.listenToKeyEvents(canvas);
  controls.addEventListener("change", render);
  container.append(canvas);
  const resize = new ResizeObserver(() => {
    const width = Math.max(1, container.clientWidth),
      height = Math.max(1, container.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const scale = Math.min(
      devicePixelRatio,
      2,
      Math.sqrt(2_000_000 / (width * height)),
    );
    renderer.setSize(
      Math.max(1, Math.floor(width * scale)),
      Math.max(1, Math.floor(height * scale)),
      false,
    );
    render();
  });
  resize.observe(container);
  fit();
  return {
    dimensions,
    spacing: extent / 10,
    canvas,
    fit,
    zoomIn: () => zoom(0.8),
    zoomOut: () => zoom(1.25),
    dispose: () => {
      resize.disconnect();
      controls.dispose();
      canvas.removeEventListener("keydown", key);
      canvas.removeEventListener("webglcontextlost", lost);
      geometry.dispose();
      material.dispose();
      grid.geometry.dispose();
      if (Array.isArray(grid.material))
        grid.material.forEach((m) => m.dispose());
      else grid.material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
