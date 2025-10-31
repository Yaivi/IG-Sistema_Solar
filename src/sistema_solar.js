import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

// ------------------ Configuración base ------------------
let scene, renderer;
let camera;
let info;
let objetos = [];
let Planetas = [];
let t0 = new Date();
let accglobal = 0.001;
let timestamp;
let flyControls;
let transformControls;
let textureLoader = new THREE.TextureLoader();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let sombra = false;
let objetoSeleccionado = null;
let objetoEditando = null;
let posOriginal = new THREE.Vector3(30, 200, 30);
let camaraFija = { x: 20, y: 50, z: 0 };
let mode = 0;
let lastTime = performance.now();
let Lunas = [];
let modoAgregarAsteroide = false;
let planoReferencia;
let textura_asteroide = textureLoader.load("src/images/asteroide.jpg");
let camaraEstatica;
let camaraActiva;
// ------------------ Planetas ------------------
let planetsData = [
  {
    name: "Mercurio",
    radio: 0.6,
    nx: 16,
    ny: 16,
    col: 0xaaaaaa,
    distancia: 20,
    velocidad: 0.24,
    rotSpeed: 0.01,
    texture: textureLoader.load("src/images/mercurymap.jpg"),
  },
  {
    name: "Venus",
    radio: 1.1,
    nx: 18,
    ny: 18,
    col: 0xaaaaaa,
    distancia: 30,
    velocidad: 0.18,
    rotSpeed: 0.008,
    texture: textureLoader.load("src/images/venusmap.jpg"),
  },
  {
    name: "Tierra",
    radio: 1.3,
    nx: 20,
    ny: 20,
    col: 0xaaaaaa,
    distancia: 45,
    velocidad: 0.12,
    rotSpeed: 0.012,
    texture: textureLoader.load("src/images/earthmap1k.jpg"),
  },
  {
    name: "Marte",
    radio: 0.9,
    nx: 16,
    ny: 16,
    col: 0xaaaaaa,
    distancia: 60,
    velocidad: 0.1,
    rotSpeed: 0.01,
    texture: textureLoader.load("src/images/marsmap1k.jpg"),
  },
  {
    name: "Júpiter",
    radio: 3.2,
    nx: 24,
    ny: 24,
    col: 0xaaaaaa,
    distancia: 90,
    velocidad: 0.06,
    rotSpeed: 0.006,
    texture: textureLoader.load("src/images/jupitermap.jpg"),
  },
  {
    name: "Saturno",
    radio: 2.8,
    nx: 22,
    ny: 22,
    col: 0xaaaaaa,
    distancia: 120,
    velocidad: 0.05,
    rotSpeed: 0.005,
    texture: textureLoader.load("src/images/saturnmap.jpg"),
  },
  {
    name: "Urano",
    radio: 2.0,
    nx: 20,
    ny: 20,
    col: 0xaaaaaa,
    distancia: 150,
    velocidad: 0.035,
    rotSpeed: 0.004,
    texture: textureLoader.load("src/images/uranusmap.jpg"),
  },
  {
    name: "Neptuno",
    radio: 1.9,
    nx: 20,
    ny: 20,
    col: 0xaaaaaa,
    distancia: 180,
    velocidad: 0.03,
    rotSpeed: 0.004,
    texture: textureLoader.load("src/images/neptunemap.jpg"),
  },
];

let moonsData = [
  {
    name: "Luna",
    radio: 0.4,
    nx: 16,
    ny: 16,
    col: 0xaaaaaa,
    distancia: 5,
    velocidad: 0.24,
    rotSpeed: 0.01,
    texture: textureLoader.load("src/images/moonmap1k.jpg"),
    planeta: "Tierra",
  },
  {
    name: "Fobos",
    radio: 0.4,
    nx: 16,
    ny: 16,
    col: 0xaaaaaa,
    distancia: 5,
    velocidad: 0.24,
    rotSpeed: 0.01,
    texture: textureLoader.load("src/images/phobosbump.jpg"),
    planeta: "Marte",
  },
  {
    name: "Deimos",
    radio: 0.3,
    nx: 16,
    ny: 16,
    col: 0xaaaaaa,
    distancia: 3,
    velocidad: 0.1,
    rotSpeed: 0.01,
    texture: textureLoader.load("src/images/deimosbump.jpg"),
    planeta: "Marte",
  },
];
init();
animationLoop();
createStarfield();

// ------------------ Inicialización ------------------
function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.fontFamily = "Monospace";
  info.innerHTML = "three.js - FlyControls";
  document.body.appendChild(info);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.copy(posOriginal);
  camera.lookAt(0, 0, 0);

  camaraActiva = camera;

  camaraEstatica = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camaraEstatica.position.set(150, 75, 150);
  camaraEstatica.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (sombra) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  document.body.appendChild(renderer.domElement);

  flyControls = new FlyControls(camera, renderer.domElement);
  resetFlyControlsMovement();
  flyControls.dragToLook = true;
  flyControls.movementSpeed = 50;
  flyControls.rollSpeed = 1;

  transformControls = new TransformControls(camera, renderer.domElement);
  scene.add(transformControls);
  transformControls.addEventListener("dragging-changed", (event) => {
    flyControls.enabled = !event.value;
  });

  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerdown", onDocumentMouseDown);

  const luzSol = new THREE.PointLight(0xffffff, 2.5, 0, 2);
  luzSol.position.set(0, 0, 0);
  scene.add(luzSol);

  scene.add(new THREE.AmbientLight(0x222222, 0.6));
  let texture1 = textureLoader.load("src/images/sunmap.jpg");
  Estrella(scene, 0, 0, 0, 10, 100, 100, 0xfff5cc, texture1);

  for (let p of planetsData) {
    const planeta = Esfera(
      scene,
      0,
      0,
      0,
      p.radio,
      p.nx,
      p.ny,
      p.col,
      p.distancia,
      p.velocidad,
      1,
      1,
      p.texture,
      p.name
    );
    Planetas.push(planeta);
  }

  crearAnillosSaturno();

  for (let m of moonsData) {
    const planetaPadre = Planetas.find(
      (planet) => planet.userData.nombre === m.planeta
    );
    if (!planetaPadre) continue;

    const luna = Esfera(
      planetaPadre,
      0,
      0,
      0,
      m.radio,
      m.nx,
      m.ny,
      m.col,
      m.distancia,
      m.velocidad,
      1,
      1,
      m.texture,
      m.name
    );
    Lunas.push(luna);
  }

  const gui = new GUI();
  const modeFolder = gui.addFolder("Modo");
  const camFolder = gui.addFolder("Cámara");
  const editFolder = gui.addFolder(
    "Creación (Solo disponibles en Modo Edición)"
  );

  modeFolder
    .add({ educativo: () => setMode(0) }, "educativo")
    .name("Modo Educativo");
  modeFolder.add({ editar: () => setMode(1) }, "editar").name("Modo Editar");
  modeFolder
    .add({ realista: () => setMode(2) }, "realista")
    .name("Modo Realista");

  editFolder
    .add(
      { agregarAsteroide: () => toggleAgregarAsteroide() },
      "agregarAsteroide"
    )
    .name("Agregar Asteroide");

  const opcionesPlanetas = ["Ninguno", ...planetsData.map((p) => p.name)];
  const opciones = { planeta: "Ninguno" };

  const opcionesCamara = {
    tipo: "Libre",
  };

  camFolder
    .add({ resetCamara: () => resetCameraPosition() }, "resetCamara")
    .name("Reset cámara");
  camFolder
    .add(opcionesCamara, "tipo", ["Libre", "Estática"])
    .name("Tipo de cámara")
    .onChange((value) => {
      switch (value) {
        case "Libre":
          camaraActiva = camera;
          flyControls.object = camera;
          break;
        case "Estática":
          camaraActiva = camaraEstatica;
          flyControls.enabled = false;
          break;
      }
    });

  camFolder
    .add(opciones, "planeta", opcionesPlanetas)
    .name("Seguir planeta")
    .onChange((value) => {
      if (value === "Ninguno") {
        objetoSeleccionado = null;
        setVistaFija();
      } else {
        objetoSeleccionado = Planetas[opcionesPlanetas.indexOf(value) - 1];
      }
    });
  camFolder.open();

  const geometryPlano = new THREE.PlaneGeometry(500, 500);
  const materialPlano = new THREE.MeshBasicMaterial({ visible: false });
  planoReferencia = new THREE.Mesh(geometryPlano, materialPlano);
  planoReferencia.rotation.x = -Math.PI / 2;
  scene.add(planoReferencia);
}

// ------------------ Animación ------------------
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;
  requestAnimationFrame(animationLoop);

  switch (mode) {
    case 0:
      actualizarPlanetasNormal();
      flyControls.object = camera;
      break;
    case 1:
      actualizarModoEditar();
      break;
    case 2:
      actualizarPlanetasNormal();
      break;
  }

  renderer.render(scene, camaraActiva);
}

// ------------------ Modos ------------------
function setMode(modo) {
  switch (modo) {
    case 0: // Modo educativo
      transformControls.detach();
      transformControls.enabled = false;

      scene.background = new THREE.Color(0x000000);
      scene.environment = null;

      for (let planet of Planetas) {
        if (planet.userData && planet.userData.orbita) {
          scene.remove(planet.userData.orbita);
          const distReal = Math.hypot(planet.position.x, planet.position.z);

          planet.userData.distancia = distReal;

          // Asegurarnos de que f1/f2 existan y sean válidos
          const f1 = planet.userData.f1 || 1;
          const f2 = planet.userData.f2 || 1;

          const curve = new THREE.EllipseCurve(
            0,
            0,
            distReal * f1,
            distReal * f2,
            0,
            2 * Math.PI,
            false,
            0
          );
          const points = curve.getPoints(100);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
          const orbita = new THREE.Line(geometry, material);

          orbita.rotation.x = Math.PI / 2;
          orbita.position.set(0, planet.position.y, 0);

          scene.add(orbita);
          planet.userData.orbita = orbita;
        }
      }

      mode = modo;
      break;

    case 1: // Modo editar
      transformControls.enabled = true;
      if (Planetas.length > 0) {
        objetoEditando = Planetas[0];
        transformControls.attach(objetoEditando);
      }
      mode = modo;
      break;

    case 2: // Modo realista
      let textureFondo = textureLoader.load("src/images/galaxy.jpg");
      textureFondo.mapping = THREE.EquirectangularReflectionMapping;
      textureFondo.encoding = THREE.sRGBEncoding;
      scene.background = textureFondo;
      scene.environment = null;

      transformControls.detach();
      transformControls.enabled = false;
      mode = modo;
      break;
  }
}

// ------------------ Funciones auxiliares ------------------
function actualizarPlanetasNormal() {
  for (let object of Planetas) {
    if (object.userData && object.userData.velocidad !== undefined) {
      object.position.x =
        Math.cos(timestamp * object.userData.velocidad) *
        object.userData.f1 *
        object.userData.distancia;
      object.position.z =
        Math.sin(timestamp * object.userData.velocidad) *
        object.userData.f2 *
        object.userData.distancia;
    }
  }
  for (let luna of Lunas) {
    if (luna.userData && luna.userData.velocidad !== undefined) {
      luna.position.x =
        Math.cos(timestamp * luna.userData.velocidad) *
        luna.userData.f1 *
        luna.userData.distancia;
      luna.position.z =
        Math.sin(timestamp * luna.userData.velocidad) *
        luna.userData.f2 *
        luna.userData.distancia;
    }
  }

  for (let object of objetos) object.rotation.y += 0.01;

  let now = performance.now();
  let delta = (now - lastTime) / 1000;
  lastTime = now;
  flyControls.update(delta);

  if (objetoSeleccionado) {
    const offset = new THREE.Vector3(-15, 2, 10);
    const targetPosition = new THREE.Vector3()
      .copy(objetoSeleccionado.position)
      .add(offset);
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(objetoSeleccionado.position);
  }
}

function actualizarModoEditar() {
  if (!objetoEditando && Planetas.length > 0) {
    objetoEditando = Planetas[0];
    transformControls.attach(objetoEditando);
  }
}

function createStarfield(count = 2000, spread = 2000) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    positions[i3 + 2] = (Math.random() - 0.5) * spread;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ size: 0.6, color: 0xffffff });
  scene.add(new THREE.Points(geo, mat));
}

function Estrella(padre, px, py, pz, radio, nx, ny, col, texture = undefined) {
  const geometry = new THREE.SphereBufferGeometry(radio, nx, ny);
  const material = new THREE.MeshBasicMaterial({ color: col, map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);
  scene.add(mesh);
  objetos.push(mesh);
}

function Esfera(
  padre,
  px,
  py,
  pz,
  radio,
  nx,
  ny,
  col,
  distancia,
  velocidad,
  f1,
  f2,
  texture = undefined,
  nombre = undefined
) {
  const geometry = new THREE.SphereBufferGeometry(radio, nx, ny);
  const material = new THREE.MeshPhongMaterial({ color: col, map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);

  if (padre instanceof THREE.Mesh) {
    padre.add(mesh);
  } else {
    scene.add(mesh);
  }

  objetos.push(mesh);

  mesh.userData = { distancia, velocidad, f1, f2, nombre };

  const curve = new THREE.EllipseCurve(0, 0, distancia * f1, distancia * f2);
  const points = curve.getPoints(100);
  const geome = new THREE.BufferGeometry().setFromPoints(points);
  const mate = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
  const orbita = new THREE.Line(geome, mate);
  orbita.rotation.x = Math.PI / 2;
  if (padre instanceof THREE.Mesh) {
    padre.add(orbita);
  } else {
    scene.add(orbita);
  }
  mesh.userData.orbita = orbita;

  return mesh;
}

function crearAnillosSaturno() {
  const saturno = Planetas.find((p) => p.userData.nombre === "Saturno");
  if (!saturno) return;

  const innerRadius = 3.5;
  const outerRadius = 5.5;
  const segments = 128;

  const ringGeometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    segments
  );
  const ringTexture = textureLoader.load("src/images/saturnringcolor.jpg");

  // Ajustar UVs de borde interior a borde exterior
  const uv = ringGeometry.attributes.uv;
  const pos = ringGeometry.attributes.position;

  for (let i = 0; i < uv.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const radius = Math.sqrt(x * x + y * y);
    const normalizedRadius =
      (radius - innerRadius) / (outerRadius - innerRadius);

    uv.setXY(i, normalizedRadius, 0);
  }

  ringGeometry.attributes.uv.needsUpdate = true;

  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);

  // Rotar para que quede horizontal
  ring.rotation.x = -Math.PI / 2;

  saturno.add(ring);
}

function setVistaFija() {
  camera.position.set(camaraFija.x, camaraFija.y, camaraFija.z);
  camera.lookAt(0, 0, 0);
}

function resetCameraPosition() {
  objetoSeleccionado = false;
  resetFlyControlsMovement();
  camera.position.copy(posOriginal);
  camera.lookAt(0, 0, 0);
}

function resetFlyControlsMovement() {
  if (!flyControls) return;
  flyControls.moveForward = false;
  flyControls.moveBackward = false;
  flyControls.moveLeft = false;
  flyControls.moveRight = false;
  flyControls.moveUp = false;
  flyControls.moveDown = false;
}

function onPointerDown(event) {
  if (mode !== 1) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objetos, false);

  if (intersects.length > 0) {
    objetoSeleccionado = intersects[0].object;
    console.log(
      "Objeto seleccionado:",
      objetoSeleccionado.name || objetoSeleccionado.uuid
    );
    transformControls.attach(objetoSeleccionado);
  } else {
    transformControls.detach();
    objetoSeleccionado = null;
  }
}

function toggleAgregarAsteroide() {
  modoAgregarAsteroide = !modoAgregarAsteroide;
}

function onDocumentMouseDown(event) {
  if (mode !== 1 || !modoAgregarAsteroide) return;

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planoReferencia);

  if (intersects.length > 0) {
    const punto = intersects[0].point;
    console.log("Punto de intersección:", punto);

    const asteroide = Esfera(
      null,
      punto.x,
      punto.y + 1,
      punto.z,
      0.1,
      16,
      16,
      0xaaaaaa,
      0,
      0,
      1,
      1,
      textura_asteroide,
      "Asteroide_" + (objetos.length + 1)
    );

    objetos.push(asteroide);
  }
}
