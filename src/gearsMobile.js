if (window.innerWidth <= 768) {
  const wrapper = document.getElementById('gear-wrapper');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const canvas = renderer.domElement;
  canvas.id = "gearCanvas";
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  wrapper.appendChild(renderer.domElement);
  
  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const camera = new THREE.PerspectiveCamera(
    45,
    wrapper.clientWidth / wrapper.clientHeight,
    0.01,
    1000
  );
  camera.position.set(1, 0, 6);
  camera.lookAt(0, 0, 0);

  const loader = new THREE.GLTFLoader();

  let gearDOM = {
    gear1: null,
    gear2: null,
    gear3: null
  };

  // Modellerin URL'lerini belirt
  const files = {
    "large-gear": "/GLB/large-gear.glb",
  };

  // GLTF modelleri yükle ve sahneye ekle
  async function loadGears() {
    const scale = 0.045;
    const gears = [];

    // Büyük dişli
    const large = await loader.loadAsync(files["large-gear"]);
    gears.push([large.scene, [1.5, 0.5, 0]]);

    // Sahneye ekle
    for (let i = 0; i < gears.length; i++) {
      const gear = gears[i][0];
      const pos = gears[i][1];

      gear.scale.set(scale, scale, scale);
      gear.position.set(...pos);
      gear.rotation.set(
        THREE.MathUtils.degToRad(90),
        THREE.MathUtils.degToRad(185),
        0
      );

      const mat = new THREE.MeshStandardMaterial({
        color: 0xffc800,
        metalness: 1,
        roughness: 0.7
      });

      gear.traverse(child => {
        if (child.isMesh) child.material = mat;
      });

      scene.add(gear);
      gearDOM[`gear${i + 1}`] = gear;
    }
  }

  loadGears();

  function onResize() {
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onResize);
  onResize();

  let direction = 1;

  function animate() {
    requestAnimationFrame(animate);

    if (gearDOM.gear1) {
      gearDOM.gear1.rotation.y += 0.012;
    }

    renderer.render(scene, camera);
  }

  animate();

}