const wrapper = document.getElementById('gear-wrapper');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const canvas = renderer.domElement;

canvas.id = "gearCanvas";

renderer.setSize(wrapper.clientWidth * (19/20), wrapper.clientHeight * (19/20));
renderer.outputEncoding = THREE.sRGBEncoding;
wrapper.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  wrapper.clientWidth / wrapper.clientHeight,
  0.01,
  1000
);


if (window.innerWidth >= 768) {
  camera.position.set(1, 0, 6);
}else {
  camera.position.set(1, 0, 8);
}
camera.lookAt(0, 0, 0);

const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.setDataType(THREE.UnsignedByteType);
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
  const missingFiles = [];

  for (const {key, url, type} of fileList) {
    const file = await getFileFromDB(key);
    if (file) {
      assets[key] = { file, type, fromCache: true };
    } else {
      missingFiles.push({key, url, type});
    }
  }

  await Promise.all(missingFiles.map(async ({key, url, type}) => {
    let loadedData;

    if (type === "glb" || type === "hdr" || type === "texture") {
      const response = await fetch(url);
      loadedData = await response.arrayBuffer();
      
      await saveFile(key, loadedData);
      assets[key] = { file: loadedData, type, fromCache: false };
    }
  }));

  const threeAssets = {};
  for (const key in assets) {
    const { file, type } = assets[key];
    if (type === "glb") {
      const blob = new Blob([file], { type: "model/gltf-binary" });
      const url = URL.createObjectURL(blob);
      threeAssets[key] = await new Promise(resolve => {
        const loader = new THREE.GLTFLoader();
        loader.load(url, gltf => resolve(gltf.scene));
      });
    } else if (type === "hdr") {
      const blob = new Blob([file], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      threeAssets[key] = await new Promise(resolve => {
        const loader = new THREE.RGBELoader()
          .setDataType(THREE.UnsignedByteType)
          .load(url, texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            resolve(texture);
          });
      });
    } else if (type === "texture") {
      const blob = new Blob([file]);
      const url = URL.createObjectURL(blob);
      threeAssets[key] = await new Promise(resolve => {
        new THREE.TextureLoader().load(url, tex => resolve(tex));
      });
    }
  }

  return threeAssets;
}


let gearDOM = {
  gear1: null,
  gear2: null,
  gear3: null
};

loadAllAssets(files).then((assets) => {
  if (assets.baseColor) assets.baseColor.encoding = THREE.sRGBEncoding;

  const scale = 0.045;
  let gears = [];

  if (assets["large-gear"]) {
      gears.push([assets["large-gear"], [-1.1, -0.5, 0]]);
  }

  if (assets["small-gear"]) {
      gears.push([assets["small-gear"].clone(), [0, 1.5, 0]]);
      gears.push([assets["small-gear"].clone(), [1.53, 0.72, 0]]);
  }

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
    );const sharedMat = new THREE.MeshStandardMaterial({
      map: assets.baseColor,
      normalMap: assets.normalMap,
      roughnessMap: assets.roughnessMap,
      metalnessMap: assets.metalnessMap,
      metalness: 1.0,
      roughness: 0.7,
      color: 0xffc800
    });

    [sharedMat.map, sharedMat.normalMap, sharedMat.roughnessMap, sharedMat.metalnessMap].forEach(tex => {
      if (tex) {
        tex.encoding = THREE.sRGBEncoding;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 4;
      }
    });

    gear.traverse((child) => {
      if (child.isMesh) {
        child.material = sharedMat;
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

  if (gearDOM.gear1 && gearDOM.gear2 && gearDOM.gear3) {
      if (direction === 1) {
          gearDOM.gear1.rotation.y += 0.006108;
          gearDOM.gear2.rotation.y -= 0.01;
          gearDOM.gear3.rotation.y += 0.01;
      } else {
          gearDOM.gear1.rotation.y -= 0.006108;
          gearDOM.gear2.rotation.y += 0.01;
          gearDOM.gear3.rotation.y -= 0.01;
      }
  }

  renderer.render(scene, camera);
}

animate();
