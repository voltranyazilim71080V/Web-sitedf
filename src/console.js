const wrapper2 = document.getElementById('gear-wrapper2');
const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer2.setSize(wrapper2.clientWidth, wrapper2.clientHeight, false);
renderer2.setClearColor(0x0e0e0e, 0);
wrapper2.appendChild(renderer2.domElement);

const scene2 = new THREE.Scene();

const camera2 = new THREE.PerspectiveCamera(45, wrapper2.clientWidth / wrapper2.clientHeight, 0.1, 1000);
camera2.position.set(2, 0, 6);
camera2.lookAt(0, 0, 0);

const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.6);
scene2.add(ambientLight2);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight2.position.set(5, 5, 2);
scene2.add(dirLight2);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight1.position.set(5, 5, 2);
scene2.add(dirLight1);

let xonsole = null;

loader.load('/GLB/console.glb', (gltf) => {
  xonsole = gltf.scene;
  xonsole.scale.set(0.035, 0.035, 0.035);
  xonsole.position.set(0, 0, 0);
  xonsole.rotation.set(
    THREE.MathUtils.degToRad(0),
    THREE.MathUtils.degToRad(15),
    THREE.MathUtils.degToRad(0)
  );
  scene2.add(xonsole);
});
camera2.position.z = 6;

window.addEventListener('resize', () => {
  camera2.aspect = wrapper2.clientWidth / wrapper2.clientHeight;
  camera2.updateProjectionMatrix();
  renderer2.setSize(wrapper2.clientWidth, wrapper2.clientHeight, false);
});

function animate2() {
  requestAnimationFrame(animate2);
  renderer2.render(scene2, camera2);
}

animate2();