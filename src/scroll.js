const navbar = document.querySelector(".navbar");
const logo = document.querySelector(".logo");
const logoTitle = document.querySelector(".logo-title");

let scroll = 0;
const satirState = {};
const screen = document.querySelector(".screen");

function onScroll() {
  const ranges = [
    { start: 456, end: 697, lines: 13 },
    { start: 1250, end: 1355, lines: 3 },
    { start: 1550, end: 1655, lines: 1 },
  ];

  scroll = screen.scrollTop;

  // Navbar küçültme / büyütme
  if (scroll > 0) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  logo.style.width = scroll > 0 ? "70px" : "80px";
  logo.style.height = scroll > 0 ? "70px" : "80px";
  logoTitle.style.fontSize = scroll > 0 ? "15px" : "20px";

  // Satır highlight işlemleri
  for (let i = 0; i < ranges.length; i++) {
    const { start, end, lines } = ranges[i];
    const span = Math.max(end - start, 1);

    let local = scroll - start;
    if (local < 0) local = 0;
    else if (local > span) local = span;

    const pct = local / span;
    const highlightLine = Math.min(Math.floor(pct * lines) + 1, lines);
    const highlightPct = (pct * lines * 100) % 100;

    for (let j = 1; j <= lines; j++) {
      const el = document.getElementById(`satir${j}_text${i + 1}`);
      if (!el) continue;

      const key = `text${i + 1}_${j}`;
      satirState[key] = satirState[key] || 0;

      let targetPct;
      if (j < highlightLine) targetPct = 100;
      else if (j === highlightLine) {
        if (highlightLine === lines && pct >= 1) targetPct = 100;
        else targetPct = highlightPct;
      } else {
        targetPct = 0;
      }

      satirState[key] += (targetPct - satirState[key]) * 0.08;

      el.style.background = `linear-gradient(to right, white ${satirState[key]}%, gray ${satirState[key]}%)`;
      el.style.webkitBackgroundClip = "text";
      el.style.webkitTextFillColor = "transparent";
    }
  }

  requestAnimationFrame(onScroll);
}

requestAnimationFrame(onScroll);
