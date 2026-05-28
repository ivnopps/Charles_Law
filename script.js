const tempSlider = document.getElementById("tempSlider");
const tempValue = document.getElementById("tempValue");
const volumeValue = document.getElementById("volumeValue");
const container = document.getElementById("container");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const soundBtn = document.getElementById("soundBtn");

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

const graphCanvas = document.getElementById("graphCanvas");
const gtx = graphCanvas.getContext("2d");

const quizPopup = document.getElementById("quizPopup");
const closeQuiz = document.getElementById("closeQuiz");

canvas.width = 250;
canvas.height = 250;

graphCanvas.width = 400;
graphCanvas.height = 300;

let animationRunning = true;
let soundOn = true;

const baseTemp = 300;
const baseVolume = 3;

let particles = [];

for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: 4
  });
}

function updateSimulation() {
  const temp = Number(tempSlider.value);

  tempValue.textContent = `${temp} K`;

  // Charles's Law
  const volume = (baseVolume * temp) / baseTemp;

  volumeValue.textContent = `${volume.toFixed(2)} L`;

  // Expand container visually
  const size = 180 + (temp - 100) * 0.25;

  container.style.width = `${size}px`;
  container.style.height = `${size}px`;

  drawGraph(temp, volume);
}

function animateParticles() {
  if (!animationRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const temp = Number(tempSlider.value);
  const speedMultiplier = temp / 200;

  particles.forEach(p => {
    p.x += p.vx * speedMultiplier;
    p.y += p.vy * speedMultiplier;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#7fdfff";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

function drawGraph(temp, volume) {
  gtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

  // Axes
  gtx.strokeStyle = "#000";
  gtx.beginPath();
  gtx.moveTo(50, 250);
  gtx.lineTo(350, 250);
  gtx.lineTo(350, 50);
  gtx.stroke();

  // Labels
  gtx.fillStyle = "#000";
  gtx.fillText("Temperature", 160, 280);
  gtx.save();
  gtx.translate(20, 180);
  gtx.rotate(-Math.PI / 2);
  gtx.fillText("Volume", 0, 0);
  gtx.restore();

  // Graph line
  gtx.strokeStyle = "#0077ff";
  gtx.lineWidth = 3;

  gtx.beginPath();

  for (let t = 100; t <= 600; t += 10) {
    let v = (baseVolume * t) / baseTemp;

    let x = 50 + ((t - 100) / 500) * 300;
    let y = 250 - (v / 6) * 180;

    if (t === 100) {
      gtx.moveTo(x, y);
    } else {
      gtx.lineTo(x, y);
    }
  }

  gtx.stroke();

  // Current point
  let currentX = 50 + ((temp - 100) / 500) * 300;
  let currentY = 250 - (volume / 6) * 180;

  gtx.beginPath();
  gtx.arc(currentX, currentY, 6, 0, Math.PI * 2);
  gtx.fillStyle = "red";
  gtx.fill();
}

tempSlider.addEventListener("input", updateSimulation);

startBtn.addEventListener("click", () => {
  animationRunning = true;
  animateParticles();
});

pauseBtn.addEventListener("click", () => {
  animationRunning = false;
});

resetBtn.addEventListener("click", () => {
  tempSlider.value = 300;
  updateSimulation();
  animationRunning = true;
  animateParticles();
});

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;

  soundBtn.textContent = soundOn
    ? "🔊 Sound"
    : "🔇 Muted";
});

document.querySelectorAll(".preset").forEach(btn => {
  btn.addEventListener("click", () => {
    tempSlider.value = btn.dataset.temp;
    updateSimulation();
  });
});

setTimeout(() => {
  quizPopup.style.display = "flex";
}, 8000);

closeQuiz.addEventListener("click", () => {
  quizPopup.style.display = "none";
});

document.querySelector(".correct").addEventListener("click", () => {
  alert("Correct! Volume increases with temperature.");
});

document.querySelector(".wrong").addEventListener("click", () => {
  alert("Incorrect. Try again!");
});

updateSimulation();
animateParticles();