let conv = [
  [document.getElementById("mechanic"), false, "mechanic"],
  [document.getElementById("software"), false, "software"],
  [document.getElementById("pr"),       false, "pr"      ],
  [document.getElementById("drive"),    false, "drive"   ]
];

let dispBlock;
let dispNone;

canvas.addEventListener("mousedown", () => {
  direction = (direction == 0) ? 1 : 0;
});

document.querySelector(".instagram").addEventListener("contextmenu", function (e) {
  e.preventDefault();

  // Instagram post sağ tık
});

for (let i = 0; i < conv.length; i++) {
  const card = conv[i][0];

  card.style.transition = "transform 0.2s ease";

  card.addEventListener("click", function () {
    if (!conv[i][1]) {
      card.style.transform = "rotateY(180deg)";

      card.addEventListener("transitionend", function handler() {
        card.style.transition = "none";
        card.style.transform = "rotateY(0deg)";
        document.getElementById(`${conv[i][2]}_front`).style.display = "none";
        document.getElementById(`${conv[i][2]}_back`).style.display  = "block";

        setTimeout(() => {
          card.style.transition = "transform 0.2s ease";
        }, 20);

        card.removeEventListener("transitionend", handler);
      });
    } else {
      card.style.transform = "rotateY(180deg)";

      card.addEventListener("transitionend", function handler() {
        card.style.transition = "none";
        card.style.transform = "rotateY(0deg)";
        document.getElementById(`${conv[i][2]}_back`).style.display  = "none";
        document.getElementById(`${conv[i][2]}_front`).style.display = "block";

        setTimeout(() => {
          card.style.transition = "transform 0.2s ease";
        }, 20);

        card.removeEventListener("transitionend", handler);
      });
    }

    conv[i][1] = !conv[i][1];
  });
}