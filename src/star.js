const container = document.querySelector(".stars-container");
const stars = [];

for (let i = 0; i < 400; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  const size = Math.random() > 0.8 ? 2 : 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;

  container.appendChild(star);
  stars.push({
    el: star,
    x: parseFloat(star.style.left),
    y: parseFloat(star.style.top),
    speedX: Math.random() * 0.0025, // yatay hız
    speedY: Math.random() * 0.0025, // dikey hız
  });
}

function animateStars() {
  stars.forEach((s) => {
    s.x += s.speedX;
    s.y += s.speedY;
    if (s.x > 100) s.x = 0;
    if (s.y > 100) s.y = 0;
    s.el.style.left = s.x + "vw";
    s.el.style.top = s.y + "vh";
  });
  requestAnimationFrame(animateStars);
}

animateStars();

/*HAREKETSİZ VERSİYON
const container = document.querySelector(".stars-container");

for (let i = 0; i < 400; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  const size = Math.random() > 0.8 ? 2 : 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;

  container.appendChild(star);
}
*/