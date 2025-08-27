const wrapper = document.getElementById('gear-wrapper');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const canvas = renderer.domElement;

renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
wrapper.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  wrapper.clientWidth / wrapper.clientHeight,
  0.01,
  1000
);
camera.position.set(1, 0, 6);
camera.lookAt(0, 0, 0);

const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.setDataType(THREE.UnsignedByteType); // r128’de genellikle gerekli
rgbeLoader.load('/texture/light.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});

const loader = new THREE.GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
let direction = 1;

const textureLoader = new THREE.TextureLoader();

async function loadAllAssets(fileList) {
  const assets = {};
  for (let i = 0; i < fileList.length; i++) {
    const { key, type } = fileList[i];
    const file = await getFileFromDB(key); // <- cache’den al

    if (!file) {
      console.warn(`${key} cache’de yok, yüklenemedi`);
      continue;
    }

    if (type === "glb") {
      const blob = new Blob([file], { type: "model/gltf-binary" });
      const blobURL = URL.createObjectURL(blob);
      assets[key] = await new Promise((resolve) => {
        const loader = new THREE.GLTFLoader();
        loader.load(blobURL, (gltf) => resolve(gltf.scene));
      });
    } else if (type === "hdr") {
      const blob = new Blob([file], { type: "application/octet-stream" });
      const blobURL = URL.createObjectURL(blob);
      assets[key] = await new Promise((resolve) => {
        const loader = new THREE.RGBELoader();
        loader.load(blobURL, (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          resolve(texture);
        });
      });
    } else if (type === "texture") {
      const blobURL = URL.createObjectURL(file);
      assets[key] = new THREE.TextureLoader().load(blobURL);
    }
  }
  return assets;
}

let gearDOM = {
  gear1: null,
  gear2: null,
  gear3: null
};


loadAllAssets(files).then((assets) => {
    if (assets.baseColor) assets.baseColor.encoding = THREE.sRGBEncoding;

    const scale = 0.045;

    let gears = [
      [assets["large-gear"], [-1.1, -0.5, 0]],
      [assets["small-gear"].clone(), [0, 1.5, 0]],
      [assets["small-gear"].clone(), [1.53, 0.72, 0]],
    ];

    for (let i = 0; i < gears.length; i++) {
      const gear = gears[i][0];
      const pos = gears[i][1];

      if (!gear) continue;

      gear.scale.set(scale, scale, scale);
      gear.position.set(...pos);
      gear.rotation.set(
        THREE.MathUtils.degToRad(90),
        THREE.MathUtils.degToRad(185),
        0
      );

      gear.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            map: assets.baseColor || null,
            normalMap: assets.normalMap || null,
            roughnessMap: assets.roughnessMap || null,
            metalnessMap: assets.metalnessMap || null,
            metalness: 0.5,
            roughness: 0.7,
            color: 0xffcc18
          });
        }
      });

      scene.add(gear);
      gearDOM[`gear${i + 1}`] = gear;
    }
  });


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

animate();
