/* ============================================================
   Optimizely · Spin to Win
   Brand system pulled from optimizely.com (Figtree, vulcan dark
   theme, Optimizely blue/purple/yellow/cyan/green palette).
   ============================================================ */

/* ---- Wheel slices (visual order, clockwise from 3 o'clock) ----
   12 slices. Odds are NOT shown to the player. */
const SEGMENTS = [
  { type: "perfume", label: "AI Perfume",  emoji: "🌸", color: "#ffce00", text: "#10141d" },
  { type: "fact",    label: "Opti Fact",   emoji: "💡", color: "#861dff", text: "#ffffff" },
  { type: "yeti",    label: "YETI Bottle", emoji: "🥤", color: "#00ccff", text: "#10141d" },
  { type: "fan",     label: "Opti Fan",    emoji: "🪭", color: "#f06250", text: "#ffffff" },
  { type: "fact",    label: "Opti Fact",   emoji: "💡", color: "#3be081", text: "#10141d" },
  { type: "yeti",    label: "YETI Bottle", emoji: "🥤", color: "#ff8110", text: "#10141d" },
  { type: "tote",    label: "Tote Bag",    emoji: "👜", color: "#0037ff", text: "#ffffff" },
  { type: "fan",     label: "Opti Fan",    emoji: "🪭", color: "#861dff", text: "#ffffff" },
  { type: "fact",    label: "Opti Fact",   emoji: "💡", color: "#00ccff", text: "#10141d" },
  { type: "yeti",    label: "YETI Bottle", emoji: "🥤", color: "#f06250", text: "#ffffff" },
  { type: "fan",     label: "Opti Fan",    emoji: "🪭", color: "#3be081", text: "#10141d" },
  { type: "fact",    label: "Opti Fact",   emoji: "💡", color: "#0037ff", text: "#ffffff" },
];

/* ---- Weighted outcome model (decoupled from visuals for exact odds) ----
   Headline odds preserved: perfume 5%, YETI 20%, fan 25%.
   Remaining 50% split between small swag wins and facts. */
const WEIGHTS = [
  { type: "perfume", p: 0.05 },
  { type: "yeti",    p: 0.20 },
  { type: "fan",     p: 0.25 },
  { type: "tote",    p: 0.10 },
  { type: "fact",    p: 0.40 },
];

const PRIZES = {
  perfume: {
    kicker: "Top Prize!",
    emoji: "🌸",
    title: "AI Personalized Perfume",
    body: "Incredible — the rarest result on the wheel! You've won a bespoke fragrance, composed by AI to match your unique profile. Our team will reach out to craft your scent.",
    confetti: "mega",
  },
  yeti: {
    kicker: "Winner!",
    emoji: "🥤",
    title: "YETI Water Bottle",
    body: "Nice spin! A rugged, ice-cold YETI bottle is heading your way. Stay hydrated while you optimize.",
    confetti: "big",
  },
  fan: {
    kicker: "Winner!",
    emoji: "🪭",
    title: "Optimizely Fan",
    body: "You won an Optimizely fan — keep cool and keep testing. A small win that's a big flex.",
    confetti: "big",
  },
  tote: {
    kicker: "Winner!",
    emoji: "👜",
    title: "Optimizely Tote Bag",
    body: "You bagged it! A sturdy Optimizely tote is heading your way — perfect for hauling your experiments (and your groceries).",
    confetti: "big",
  },
};

const FACTS = [
  "Optimizely was founded in 2010 by Dan Siroker and Pete Koomen, two former Googlers on a mission to make experimentation easy for everyone.",
  "Dan Siroker was Director of Analytics for the 2008 Obama campaign, where A/B testing the donation pages helped raise tens of millions in extra contributions — the spark that became Optimizely.",
  "Optimizely's Stats Engine uses sequential testing to deliver always-valid results, so you can trust your data the moment you check it — no waiting for a fixed sample size.",
  "In 2020, Optimizely merged with Episerver, and in 2021 the combined company adopted the Optimizely name and its Digital Experience Platform vision.",
  "The golden rule of experimentation: don't argue about the best button color — ship an A/B test and let your users decide.",
  "Optimizely powers Web, Feature, and Server-side experimentation, plus content, commerce, and a CDP — a full Digital Experience Platform.",
  "Feature flags let teams roll out (and roll back) changes instantly — decoupling 'deploy' from 'release' so you can experiment safely in production.",
  "A 'HiPPO' is the Highest Paid Person's Opinion. Experimentation exists to replace HiPPO-driven decisions with evidence.",
  "Even tiny tweaks can compound: a 2% lift on each step of a funnel multiplies into a dramatically bigger result at the end.",
  "The best experimenters celebrate losing tests too — a failed variation still teaches you something true about your customers.",
  "Opal is Optimizely's AI assistant, built to help teams create content and run experiments faster across the platform.",
  "Optimizely serves thousands of brands — including Salesforce, Nike, and Zoom — to power their digital experiences.",
];

/* ============================================================
   Canvas wheel rendering
   ============================================================ */
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const SEG = SEGMENTS.length;
const SEG_ANGLE = (Math.PI * 2) / SEG;
const TOP = (3 * Math.PI) / 2; // pointer position in canvas angle space

let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
let size, cx, cy, radius;
let rotation = 0;
let spinning = false;
let lastFactIndex = -1;

function setupCanvas() {
  const css = canvas.getBoundingClientRect().width || 480;
  size = css;
  dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cx = size / 2;
  cy = size / 2;
  radius = size / 2 - 6;
}

function drawWheel(t = 0) {
  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  for (let i = 0; i < SEG; i++) {
    const start = i * SEG_ANGLE;
    const end = start + SEG_ANGLE;
    const seg = SEGMENTS[i];

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();

    // depth shading
    const grad = ctx.createRadialGradient(0, 0, radius * 0.18, 0, 0, radius);
    grad.addColorStop(0, "rgba(255,255,255,0.12)");
    grad.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = grad;
    ctx.fill();

    // divider
    ctx.strokeStyle = "rgba(16,20,29,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // label
    ctx.save();
    ctx.rotate(start + SEG_ANGLE / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = seg.text;
    ctx.font = `800 ${Math.round(size * 0.030)}px "Figtree", sans-serif`;
    ctx.fillText(seg.label, radius - 16, size * 0.012);
    ctx.font = `${Math.round(size * 0.052)}px "Figtree", sans-serif`;
    ctx.fillText(seg.emoji, radius - 16, -size * 0.040);
    ctx.restore();
  }
  ctx.restore();

  // ---- static rim + blinking bulbs ----
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
  ctx.lineWidth = 9;
  ctx.strokeStyle = "#10141d";
  ctx.stroke();

  const bulbs = 28;
  for (let i = 0; i < bulbs; i++) {
    const a = (i / bulbs) * Math.PI * 2;
    const bx = Math.cos(a) * (radius - 1);
    const by = Math.sin(a) * (radius - 1);
    const phase = Math.sin(t / 240 + i * 0.7) * 0.5 + 0.5;
    const on = (Math.floor(t / 240) + i) % 2 === 0;
    const glow = on ? 0.6 + phase * 0.4 : 0.18 + phase * 0.2;
    ctx.beginPath();
    ctx.arc(bx, by, size * 0.011, 0, Math.PI * 2);
    ctx.fillStyle = on ? "#ffce00" : "#ffffff";
    ctx.globalAlpha = glow;
    ctx.shadowColor = on ? "#ffce00" : "#ffffff";
    ctx.shadowBlur = on ? 12 : 4;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.restore();
}

function loop(t) {
  drawWheel(t);
  requestAnimationFrame(loop);
}

/* ============================================================
   Spin logic
   ============================================================ */
function pickOutcome() {
  const r = Math.random();
  let acc = 0;
  for (const w of WEIGHTS) {
    acc += w.p;
    if (r < acc) return w.type;
  }
  return "fact";
}

function segmentsOfType(type) {
  const idx = [];
  SEGMENTS.forEach((s, i) => { if (s.type === type) idx.push(i); });
  return idx;
}

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

function spin() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  spinBtn.classList.add("spinning");

  const outcome = pickOutcome();
  const candidates = segmentsOfType(outcome);
  const targetIdx = candidates[Math.floor(Math.random() * candidates.length)];

  const centerAngle = targetIdx * SEG_ANGLE + SEG_ANGLE / 2;
  const jitter = (Math.random() - 0.5) * SEG_ANGLE * 0.6;

  const fullSpins = 8 + Math.floor(Math.random() * 3);
  let delta = (TOP - centerAngle - jitter - rotation) % (Math.PI * 2);
  if (delta < 0) delta += Math.PI * 2;
  const finalRotation = rotation + fullSpins * Math.PI * 2 + delta;

  const startRotation = rotation;
  const duration = 7200;
  let startTime = null;

  function animate(ts) {
    if (startTime === null) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    rotation = startRotation + (finalRotation - startRotation) * easeOutCubic(p);
    if (p < 1) {
      requestAnimationFrame(animate);
    } else {
      rotation = finalRotation % (Math.PI * 2);
      spinning = false;
      spinBtn.classList.remove("spinning");
      setTimeout(() => showResult(outcome), 450);
    }
  }
  requestAnimationFrame(animate);
}

/* ============================================================
   Result + modal
   ============================================================ */
const modal = document.getElementById("modal");
const modalEmoji = document.getElementById("modalEmoji");
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalBtn = document.getElementById("modalBtn");
const modalFine = document.getElementById("modalFine");
const spinBtn = document.getElementById("spinBtn");

function showResult(type) {
  if (type === "fact") {
    let i = Math.floor(Math.random() * FACTS.length);
    if (i === lastFactIndex) i = (i + 1) % FACTS.length;
    lastFactIndex = i;

    modalEmoji.textContent = "💡";
    modalKicker.textContent = "Not this time";
    modalKicker.style.color = "var(--cyan)";
    modalTitle.textContent = "Did you know?";
    modalBody.textContent = FACTS[i];
    modalBtn.textContent = "Spin again";
    modalFine.textContent = "Every spin is an experiment — try again!";
  } else {
    const prize = PRIZES[type];
    modalEmoji.textContent = prize.emoji;
    modalKicker.textContent = prize.kicker;
    modalKicker.style.color = "var(--yellow)";
    modalTitle.textContent = prize.title;
    modalBody.textContent = prize.body;
    modalBtn.textContent = "Spin again";
    modalFine.textContent = "Powered by Optimizely experimentation";
    fireConfetti(prize.confetti);
    playChime(type === "perfume");
  }
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  spinBtn.disabled = false;
}

modalBtn.addEventListener("click", () => { closeModal(); setTimeout(spin, 250); });
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
spinBtn.addEventListener("click", spin);

/* ============================================================
   Confetti
   ============================================================ */
const confCanvas = document.getElementById("confetti");
const confCtx = confCanvas.getContext("2d");
let confetti = [];
const CONF_COLORS = ["#0037ff", "#861dff", "#ffce00", "#00ccff", "#3be081", "#ff8110", "#f06250", "#ffffff"];

/* --- Optimizely petal mark (the "O" symbol), as flying logo confetti --- */
const PETAL_PATHS =
  '<path d="m12.8359 20.4556v4.485c3.4221-.004 6.7029-1.3235 9.1227-3.6691s3.781-5.5257 3.7852-8.8428h-4.627c-.0027 2.128-.8761 4.1682-2.4284 5.6729-1.5524 1.5048-3.6571 2.3513-5.8525 2.354z"/>' +
  '<path d="m12.8346 32.8099c-2.1796 0-4.26989-.8393-5.81108-2.3332-1.5412-1.4939-2.40703-3.5201-2.40703-5.6328 0-2.1128.86583-4.1389 2.40703-5.6329 1.54119-1.4939 3.63148-2.3332 5.81108-2.3332v-4.452c-1.6831-.0023-3.35011.3167-4.90597.9389-1.55586.6221-2.97007 1.5353-4.16187 2.6872s-2.13786 2.5202-2.784159 4.0265c-.6463 1.5064-.98018355 3.1214-.98258792 4.7528s.32671792 3.2473.96857492 4.7555c.641862 1.5081 1.583882 2.8789 2.772282 4.0342 1.1884 1.1552 2.59991 2.0723 4.15393 2.6987 1.55402.6265 3.2201.9502 4.9032.9525h.0366z"/>' +
  '<path d="m12.8359 32.81v4.452c3.3991 0 6.659-1.3088 9.0625-3.6386s3.7538-5.4897 3.7538-8.7845h-4.5981c-.0014 2.1127-.8675 4.1387-2.4083 5.6331-1.5407 1.4944-3.6302 2.3353-5.8099 2.338z"/>' +
  '<path d="m12.8359 7.9711v4.452c3.3991 0 6.659-1.3088 9.0625-3.63861 2.4035-2.32979 3.7538-5.48967 3.7538-8.78449h-4.5981c-.0014 2.11278-.8675 4.13871-2.4083 5.63314-1.5407 1.49444-3.6302 2.33527-5.8099 2.33796z"/>' +
  '<path d="m25.7266 7.9711v4.452c3.3991 0 6.6589-1.3088 9.0624-3.63861 2.4036-2.32979 3.7538-5.48967 3.7538-8.78449h-4.5955c-.0014 2.11321-.8679 4.13953-2.4092 5.63404-1.5413 1.4945-3.6314 2.33504-5.8115 2.33706z"/>';

function logoImage(svgInner, attrs) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 38" ' + attrs + '>' + svgInner + '</svg>';
  const img = new Image();
  img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  return img;
}
// white mark + an iridescent "Opal" gradient mark (cyan→blue→purple)
const LOGO_WHITE = logoImage(PETAL_PATHS, 'fill="#ffffff"');
const LOGO_GRAD = logoImage(
  '<defs><linearGradient id="og" x1="0" y1="0" x2="39" y2="38" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0" stop-color="#00ccff"/><stop offset=".5" stop-color="#0037ff"/><stop offset="1" stop-color="#861dff"/>' +
  '</linearGradient></defs><g fill="url(#og)">' + PETAL_PATHS + '</g>',
  ''
);
const LOGO_IMGS = [LOGO_WHITE, LOGO_GRAD, LOGO_WHITE];

function resizeConfetti() {
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;
}

function spawnPiece(o, isLogo) {
  return {
    x: o.x + (Math.random() - 0.5) * o.spread,
    y: o.y + (Math.random() - 0.5) * 20,
    vx: (o.vx || 0) + (Math.random() - 0.5) * 15,
    vy: o.vyBase * (0.6 + Math.random() * 0.6),
    g: 0.34 + Math.random() * 0.2,
    size: isLogo ? 18 + Math.random() * 16 : 6 + Math.random() * 8,
    color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * (isLogo ? 0.16 : 0.4),
    life: 1,
    decay: 0.005 + Math.random() * 0.003,
    isLogo,
    img: isLogo ? LOGO_IMGS[Math.floor(Math.random() * LOGO_IMGS.length)] : null,
  };
}

function burst(scale) {
  const W = window.innerWidth, H = window.innerHeight;
  const mega = scale === "mega";
  const rects = mega ? 380 : 210;
  const logos = mega ? 48 : 28;
  // center pop + two lower-corner cannons for full-screen coverage
  const origins = [
    { x: W / 2, y: H * 0.48, spread: 280, vyBase: -18 },
    { x: W * 0.10, y: H * 0.95, spread: 90, vyBase: -24, vx: 7 },
    { x: W * 0.90, y: H * 0.95, spread: 90, vyBase: -24, vx: -7 },
  ];
  for (let i = 0; i < rects; i++) confetti.push(spawnPiece(origins[i % origins.length], false));
  for (let i = 0; i < logos; i++) confetti.push(spawnPiece(origins[i % origins.length], true));
}

function fireConfetti(scale) {
  resizeConfetti();
  burst(scale);
  if (scale === "mega") setTimeout(() => { burst("mega"); runConfetti(); }, 380); // sustained celebration for the top prize
  runConfetti();
}

let confRunning = false;
function runConfetti() {
  if (confRunning) return;
  confRunning = true;
  function frame() {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    confetti.forEach((c) => {
      c.vy += c.g; c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.life -= c.decay;
      confCtx.save();
      confCtx.translate(c.x, c.y);
      confCtx.rotate(c.rot);
      confCtx.globalAlpha = Math.max(0, c.life);
      if (c.isLogo && c.img.complete && c.img.naturalWidth) {
        confCtx.drawImage(c.img, -c.size / 2, -c.size / 2, c.size, c.size);
      } else {
        confCtx.fillStyle = c.color;
        confCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      }
      confCtx.restore();
    });
    confetti = confetti.filter((c) => c.life > 0 && c.y < confCanvas.height + 60);
    if (confetti.length) {
      requestAnimationFrame(frame);
    } else {
      confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
      confRunning = false;
    }
  }
  requestAnimationFrame(frame);
}

/* ============================================================
   Win chime (WebAudio, no assets)
   ============================================================ */
let audioCtx;
function playChime(grand) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = grand ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t0 = audioCtx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.55);
    });
  } catch (e) { /* audio optional */ }
}

/* ============================================================
   Boot
   ============================================================ */
window.addEventListener("resize", setupCanvas);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !spinning && !modal.classList.contains("show")) { e.preventDefault(); spin(); }
  if (e.code === "Escape") closeModal();
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(setupCanvas);
}

setupCanvas();
requestAnimationFrame(loop);
