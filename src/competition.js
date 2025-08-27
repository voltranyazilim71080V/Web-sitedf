let loadElements = [
  { 
    url: '/GLB/vrc_element_1.glb',
    scale: [30, 30, 30],
    position: [0, 0, -0.2],
    rotation: [0, 45, 45],
    element: null
  }/*,
  { 
    url: '/GLB/vrc_element_2.glb',
    scale: [15, 15, 15],
    position: [-15, -2, -10],
    rotation: [90, 0, 75],
    element: null
  },
  {
    url: '/GLB/vrc_element_3.glb',
    scale: [15, 15, 15],
    position: [-15, 2, -10],
    rotation: [90, 0, 75],
    element: null
  }*/
];

let FRCloadElements = [
  { 
    url: '/GLB/frc_element_1.glb',
    scale: [0.14, 0.14, 0.14],
    position: [0, 0, -0.2],
    rotation: [0, 45, 45],
    element: null
  }/*,
  { 
    url: '/GLB/vrc_element_2.glb',
    scale: [15, 15, 15],
    position: [-15, -2, -10],
    rotation: [90, 0, 75],
    element: null
  },
  {
    url: '/GLB/vrc_element_3.glb',
    scale: [15, 15, 15],
    position: [-15, 2, -10],
    rotation: [90, 0, 75],
    element: null
  }*/
];

function createScene(wrapperId, loadElements) {
  const wrapper = document.getElementById(wrapperId);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight, false);
  renderer.setClearColor(0x0e0e0e, 0);
  wrapper.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
  camera.position.set(2, 0, 6);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight1.position.set(5,5,2);
  scene.add(dirLight1);
  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight2.position.set(5,5,2);
  scene.add(dirLight2);

  let isDragging = false;
  let previousMousePosition = {x:0, y:0};

  wrapper.addEventListener('mousedown', e => { isDragging = true; previousMousePosition = {x:e.clientX, y:e.clientY}; });
  wrapper.addEventListener('mouseup', () => isDragging = false);
  wrapper.addEventListener('mouseleave', () => isDragging = false);
  wrapper.addEventListener('mousemove', e => {
    if (!isDragging || !loadElements[0].element) return;
    const deltaMove = {x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y};
    const rotationSpeed = 0.005;
    loadElements[0].element.rotation.y += deltaMove.x * rotationSpeed;
    loadElements[0].element.rotation.x += deltaMove.y * rotationSpeed;
    previousMousePosition = {x: e.clientX, y: e.clientY};
  });

  const loader = new THREE.GLTFLoader();
  loadElements.forEach(el => {
    loader.load(el.url, gltf => {
      const radians = el.rotation.map(a => a * Math.PI/180);
      el.element = gltf.scene;
      el.element.scale.set(...el.scale);
      el.element.position.set(...el.position);
      el.element.rotation.set(...radians);
      scene.add(el.element);
    });
  });

  window.addEventListener('resize', () => {
    camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight, false);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return {scene, camera, renderer, elements: loadElements};
}

window.FRC = createScene('frc', FRCloadElements);
window.VRC = createScene('vrc', loadElements);