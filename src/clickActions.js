let conv = [
  [document.getElementById("mechanic"), false, "mechanic"],
  [document.getElementById("software"), false, "software"],
  [document.getElementById("pr"), false, "pr"],
  [document.getElementById("drive"), false, "drive"]
];

let dispBlock;
let dispNone;

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

