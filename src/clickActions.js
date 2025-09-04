let conv = [
  [document.getElementById("mechanic"), false, "mechanic"],
  [document.getElementById("software"), false, "software"],
  [document.getElementById("pr"), false, "pr"],
  [document.getElementById("drive"), false, "drive"]
];

let dispBlock;

const slider = document.querySelector('.slider');
const items = document.querySelectorAll('.trophy-item');
const awardText = document.querySelector('#award-text');

let activeIndex = Math.floor(items.length / 2);
let dispNone;

let directionSlider = null;

let awards= [
  "2022 VRC ISTANBUL REGIONAL CHAMPIONSHIP",
  "2023 VRC ISTANBUL REGIONAL ENERGY AWARD",
  "2024 VRC ISTANBUL REGIONAL INNOVATE AWARD",
  "2019 FRC TURKIYE CHAMPIONSHIP",
  "2019 FRC WORLD QUARTER FINALIST",
  "2023 VRC TEAM CAPTAIN OF THE YEAR",
  "2023 VRC TEAM CAPTAIN OF THE YEAR"
];

canvas.addEventListener("mousedown", () => {
  direction = (direction == 0) ? 1 : 0;
});

document.querySelector(".instagram").addEventListener("contextmenu", function(e) {
  e.preventDefault();

  // Instagram post sağ tık
});

for (let i = 0; i < conv.length; i++) {
  const card = conv[i][0];

  card.addEventListener("click", function() {
    card.classList.toggle("flipped");
    conv[i][1] = !conv[i][1];
  });
}

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
const gap = 20;
const snapDuration = 300;

let lastIndex = 3;
let lastX = 0;
let lastTime = 0;
let velocity = 0;
const FLICK_VELOCITY_THRESHOLD = 800;

function getItemWidth() {
  return items[0].offsetWidth;
}

function getStep() {
  if (items.length < 2) return getItemWidth() + gap;
  const r0 = items[0].getBoundingClientRect();
  const r1 = items[1].getBoundingClientRect();
  const step = Math.round(r1.left - r0.left);
  return step > 0 ? step : (getItemWidth() + gap);
}

function clampIndex(i) {
  return Math.max(0, Math.min(items.length - 1, i));
}

function setTranslate(x, withTransition = true) {
  const px = Math.round(x);
  if (withTransition) slider.style.transition = `transform ${snapDuration}ms cubic-bezier(.2,.8,.2,1)`;
  else slider.style.transition = 'none';
  
  slider.style.transform = `translate3d(${px}px, 0, 0)`;
  currentTranslate = px;
}

function updateSlider() {
  items.forEach(item => item.classList.remove('active'));
  items[activeIndex].classList.add('active');
  awardText.textContent = awards[activeIndex];

  const sliderWidth = slider.offsetWidth;
  const itemWidth = getItemWidth();
  const step = getStep();

  const offset = step * activeIndex - sliderWidth / 2 + itemWidth / 2 + 50;
  let targetTranslate = -offset;
  targetTranslate = (activeIndex == 1 && directionSlider == 1) ? targetTranslate + 150 : targetTranslate;

  setTranslate(targetTranslate, true);
  prevTranslate = currentTranslate;
}

updateSlider();

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    if (activeIndex != items.length - 1) {
      activeIndex = clampIndex(activeIndex + 1);
      directionSlider = 1;
      updateSlider();
    }
  }
  if (e.key === 'ArrowLeft') {
    if (activeIndex != 0) {
      activeIndex = clampIndex(activeIndex - 1);
      directionSlider = 0;
      updateSlider();
    }
  }
});

function pointerDown(clientX) {
  isDragging = true;
  startX = clientX;
  
  prevTranslate = currentTranslate;
  slider.style.transition = 'none';
  document.body.style.userSelect = 'none';

  lastIndex = activeIndex;
  lastX = clientX;
  lastTime = performance.now();
  velocity = 0;
}

function pointerMove(clientX) {
  if (!isDragging) return;
  const delta = clientX - startX;
  const next = prevTranslate + delta;
  setTranslate(next, false);

  const now = performance.now();
  const dt = now - lastTime || 16;
  const dx = clientX - lastX;
  velocity = (dx / dt) * 1000;
  lastX = clientX;
  lastTime = now;
}

function pointerUp() {
  if (!isDragging) return;
  isDragging = false;
  document.body.style.userSelect = '';

  const sliderWidth = slider.offsetWidth;
  const itemWidth = getItemWidth();
  const step = getStep();

  const rawOffset = -currentTranslate;
  const floatIndex = (rawOffset + sliderWidth / 2 - itemWidth / 2) / step;
  let newIndex = Math.round(floatIndex);

  newIndex = (Math.abs(velocity) > FLICK_VELOCITY_THRESHOLD)
    ? newIndex - Math.sign(velocity)
    : newIndex;

  newIndex = clampIndex(newIndex);

  // 🔽 yön belirleme (mouse için)
  if (newIndex > activeIndex) {
    directionSlider = 1; // sağa kaydırıldı
  } else if (newIndex < activeIndex) {
    directionSlider = 0; // sola kaydırıldı
  }

  activeIndex = newIndex;
  updateSlider();

  prevTranslate = currentTranslate;
  velocity = 0;
}


slider.addEventListener('mousedown', e => {
  e.preventDefault();
  pointerDown(e.clientX);
});
window.addEventListener('mousemove', e => pointerMove(e.clientX));
window.addEventListener('mouseup', pointerUp);

slider.addEventListener('touchstart', e => {
  pointerDown(e.touches[0].clientX);
}, {passive: true});

slider.addEventListener('touchmove', e => {
  pointerMove(e.touches[0].clientX);
}, {passive: true});

slider.addEventListener('touchend', pointerUp);
slider.addEventListener('dragstart', e => e.preventDefault());

window.addEventListener('resize', () => {
  updateSlider();
});

document.addEventListener('DOMContentLoaded', () => {
  activeIndex = clampIndex(3);
  updateSlider();
}, { once: true });