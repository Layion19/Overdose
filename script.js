let clickCount = 0;
let platformOpened = false;

const textContainer = document.getElementById("textContainer");
const banner = document.querySelector("#banner img");
const platformLayer = document.getElementById("platform-layer");
const experienceLayer = document.getElementById("experience-layer");
const chainLogo = document.getElementById("chain-logo");
const connectBtn = document.getElementById("connectWalletBtn");
const launchBtn = document.getElementById("launchBtn");

const mainText = "Daily Dose";

const phrases = [
  "You laughed at the meme.",
  "You aped the launch.",
  "You chased the pump.",
  "You felt the dump.",
  "You called it bad luck.",
  "It wasn't.",
  "It was structure.",
  "OVERDOSE is the signal."
];

let capsuleCount = 0;
let capsulesPerRow = 0;
let maxRows = 0;

/* ================= CLICK EXPERIENCE ================= */

document.body.addEventListener("click", () => {
  if (platformOpened || autoModeActive) return;
  clickCount++;
  spawnCapsuleMirror(); // effet miroir : 2 capsules à la fois (gauche + droite)
  updateManualText();
});

function updateManualText() {
  if (clickCount === 1) {
    renderText("");
    return;
  }
  const letterIndex = clickCount - 2;
  if (letterIndex < mainText.length) {
    renderText(mainText.slice(0, letterIndex + 1));
  }
  if (clickCount === 5) {
    autoModeActive = true;
    startAutoMode();
  }
}

function renderText(text) {
  textContainer.innerHTML = "";
  const dot = document.createElement("span");
  dot.classList.add("green-dot");
  dot.innerText = "•";
  textContainer.appendChild(dot);
  textContainer.innerHTML += text;
}

/* ================= CAPSULE SYSTEM ================= */

function computeLayout() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  // 130px sur desktop, proportionnel sur mobile, edge-to-edge exact
  const base = Math.min(130, screenWidth / 8);
  capsulesPerRow = Math.round(screenWidth / base);
  const capsuleWidth = screenWidth / capsulesPerRow;
  const coverageHeight = screenHeight * 0.45;
  const rowHeight = capsuleWidth * 0.38;
  maxRows = Math.floor(coverageHeight / rowHeight);
  return { capsuleWidth, screenWidth, screenHeight, rowHeight };
}

/* Place une capsule à un index donné dans la grille */
function spawnCapsuleAt(index) {
  const { capsuleWidth, screenWidth, screenHeight, rowHeight } = computeLayout();

  const row = Math.floor(index / capsulesPerRow);
  const col = index % capsulesPerRow;

  if (row >= maxRows) return;

  const rect = banner.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  const capsule = document.createElement("img");
  capsule.src = "assets/capsule.png";
  capsule.classList.add("capsule");
  capsule.style.width = (screenWidth / capsulesPerRow) + "px";
  capsule.style.left = startX + "px";
  capsule.style.top = startY + "px";
  capsule.style.transform = "translate(-50%, -50%)";
  document.getElementById("capsule-container").appendChild(capsule);

  // Edge to edge parfait : réparti sur toute la largeur écran
  const slightRandomX = (Math.random() - 0.5) * 3;
  const slightRandomY = Math.random() * 3;
  const exactW = screenWidth / capsulesPerRow; // largeur exacte sans débordement
  const targetX = col * exactW + slightRandomX;
  const bottomBase = screenHeight - 40;
  const targetY = bottomBase - (row * rowHeight) - slightRandomY;

  requestAnimationFrame(() => {
    capsule.style.left = targetX + "px";
    capsule.style.top = targetY + "px";
    capsule.style.transform = `rotate(${Math.random() * 360}deg)`;
  });
}

/*
  Effet miroir :
  On part du centre de la rangée, et on place simultanément
  une capsule à gauche du centre et une à droite.
  index miroir gauche  = centre - offset
  index miroir droite  = centre + offset
*/
function spawnCapsuleMirror() {
  computeLayout();

  // Paires à placer par rangée = capsulesPerRow / 2 (arrondi sup)
  const pairsPerRow = Math.ceil(capsulesPerRow / 2);
  const pairsPlaced = Math.floor(capsuleCount / 2);
  const row         = Math.floor(pairsPlaced / pairsPerRow);
  const offset      = pairsPlaced % pairsPerRow;

  // Centre : on part du milieu et on s'écarte
  const center    = Math.floor((capsulesPerRow - 1) / 2);
  const rowBase   = row * capsulesPerRow;

  const leftIndex  = rowBase + center - offset;
  const rightIndex = rowBase + center + offset + (capsulesPerRow % 2 === 0 ? 1 : 0);

  // Toujours dans les bornes de la rangée
  if (leftIndex >= rowBase && leftIndex < rowBase + capsulesPerRow)
    spawnCapsuleAt(leftIndex);
  if (rightIndex < rowBase + capsulesPerRow && rightIndex !== leftIndex)
    spawnCapsuleAt(rightIndex);

  capsuleCount += 2;
}

/* ================= AUTO MODE ================= */

function startAutoMode() {
  // Afficher le texte complet avant de commencer
  renderText(mainText);

  // Pluie rapide pour remplir toutes les capsules restantes
  const rainInterval = setInterval(() => {
    const total = capsulesPerRow * maxRows;
    if (capsuleCount >= total) {
      clearInterval(rainInterval);
      // Toutes les capsules posées → on lance les phrases
      setTimeout(startPhraseSequence, 800);
      return;
    }
    spawnCapsuleMirror();
  }, 60);
}

/* ================= PHRASES (après capsules) ================= */

function startPhraseSequence() {
  let phraseIndex = 0;

  const textInterval = setInterval(() => {
    if (phraseIndex >= phrases.length) {
      clearInterval(textInterval);
      setTimeout(showFinalMessage, 1500);
      return;
    }
    typeFullLine(phrases[phraseIndex]);
    phraseIndex++;
  }, 2500);
}

function typeFullLine(text) {
  textContainer.innerHTML = "";
  const dot = document.createElement("span");
  dot.classList.add("green-dot");
  dot.innerText = "•";
  textContainer.appendChild(dot);
  let i = 0;
  const interval = setInterval(() => {
    textContainer.innerHTML += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 25);
}

/* ================= FINAL ================= */

function showFinalMessage() {
  textContainer.innerHTML = "";
  let finalText = "You were never in control.";
  let i = 0;
  const interval = setInterval(() => {
    textContainer.innerHTML += finalText[i];
    i++;
    if (i >= finalText.length) {
      clearInterval(interval);
      setTimeout(revealOverdose, 1200);
    }
  }, 35);
}

function revealOverdose() {
  textContainer.innerHTML = `<span class="overdose-word">OVERDOSE</span><span class="notfun-word">≠FUN</span>`;
  setTimeout(openPlatformLayer, 2000);
}

function openPlatformLayer() {
  if (platformOpened) return;
  platformOpened = true;
  experienceLayer.style.pointerEvents = "none";
  platformLayer.style.clipPath = "circle(150% at 100% 100%)";
  setTimeout(() => {
    experienceLayer.style.visibility = "hidden";
    experienceLayer.style.display    = "none";
  }, 1300);
}

/* ================= SWITCH CHAIN ================= */

function doSwitch() {
  if (!platformOpened) return;
  if (document.body.classList.contains("solana-theme")) {
    document.body.classList.replace("solana-theme", "eth-theme");
    chainLogo.src = "assets/ethereum-logo.png";
  } else {
    document.body.classList.replace("eth-theme", "solana-theme");
    chainLogo.src = "assets/solana-logo.png";
  }
}

chainLogo.addEventListener("click", doSwitch);
document.getElementById("switchBtn").addEventListener("click", doSwitch);

launchBtn.addEventListener("click", () => { alert("Launch Soon"); });
connectBtn.addEventListener("click", () => { alert("Wallet connection coming soon."); });