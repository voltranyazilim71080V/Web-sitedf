const wrapper = document.getElementById("gear-wrapper");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const canvas = renderer.domElement;
const loader = new THREE.GLTFLoader();
const textureloader = new THREE.TextureLoader();
const rgbeLoader = new THREE.RGBELoader();

renderer.setSize(wrapper.clientWidth, wrapper.clientHeight, false);
renderer.setClearColor(0x0e0e0e, 0);
wrapper.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  wrapper.clientWidth / wrapper.clientHeight,
  0.01,
  1000,
);
camera.position.set(1, 0, 6);
camera.lookAt(0, 0, 0);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5); // x, y, z
keyLight.target.position.set(0, 0, 0); // çarkların ortasına bakıyor purna
scene.add(keyLight);
scene.add(keyLight.target);

// Fill light: sol üst ön, gölgeleri yumuşatır
const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
fillLight.position.set(-5, 3, 2);
fillLight.target.position.set(0, 0, 0);
scene.add(fillLight);
scene.add(fillLight.target);

// Rim light / back light: üstten arkadan, objeyi arka plandan ayırır
const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
rimLight.position.set(0, 5, -5);
rimLight.target.position.set(0, 0, 0);
scene.add(rimLight);
scene.add(rimLight.target);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 2.5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // mevcut
ambientLight.intensity = 0.8; // artır
scene.add(ambientLight);

loader.setMeshoptDecoder(MeshoptDecoder);

const colorMap = textureloader.load("texturex/texture1.jpg");
const roughnessMap = textureloader.load("texturex/texture2.jpg");
const metalnessMap = textureloader.load("texturex/texture3.jpg");
const normalMap = textureloader.load("texturex/texture4.jpg");
const displacementMap = textureloader.load("texturex/texture5.jpg");

let direction = 1;

const scale = 0.045;

let gears = [
  [null, [-1.1, -1, 0]],
  [null, [0, 1, 0]],
  [null, [1.53, 0.22, 0]],
];

async function loadGear(num) {
  const url = num == 0 ? "/GLB/large-gear.glb" : "/GLB/small-gear.glb";
  const arrayBuffer = await getFromDB(url);

  if (!arrayBuffer) return console.error("File not found in cache:", url);

  const blob = new Blob([arrayBuffer], { type: "model/gltf-binary" });
  const blobUrl = URL.createObjectURL(blob);

  loader.load(blobUrl, (gltf) => {
    gears[num][0] = gltf.scene;
    gears[num][0].scale.set(scale, scale, scale);
    gears[num][0].position.set(
      gears[num][1][0],
      gears[num][1][1],
      gears[num][1][2],
    );
    gears[num][0].rotation.set(
      THREE.MathUtils.degToRad(90),
      THREE.MathUtils.degToRad(num == 0 ? 185 : 180),
      THREE.MathUtils.degToRad(0),
    );

    gears[num][0].traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: colorMap,
          roughnessMap: roughnessMap,
          metalnessMap: metalnessMap,
          normalMap: normalMap,
          displacementMap: displacementMap,
          displacementScale: 0.01, // küçük tut
          metalness: 0.6, // maksimum metal hissi
          roughness: 1, // parlaklığı artır
          color: 0xffcc18, // sarı overlay istemezsen beyaz yap
        });
      }
    });

    scene.add(gears[num][0]);
  });
}

function onResize() {
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", onResize);
onResize();

function animate() {
  requestAnimationFrame(animate);

  if (gears[0][0] && gears[1][0] && gears[2][0]) {
    if (direction === 1) {
      gears[0][0].rotation.y += 0.006108;
      gears[1][0].rotation.y -= 0.01;
      gears[2][0].rotation.y += 0.01;
    } else {
      gears[0][0].rotation.y -= 0.006108;
      gears[1][0].rotation.y += 0.01;
      gears[2][0].rotation.y -= 0.01;
    }
  }

  renderer.render(scene, camera);
}

for (let i = 0; i < 3; i++) {
  loadGear(i);
}

animate();
