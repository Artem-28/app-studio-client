<template>
  <canvas
    ref="canvas"
    class="bg"
    @mousemove="mouseMove"
    @mouseleave="mouseLeave"
    @click="mouseClick"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

////////////////////////////////////////////////////////////
// Canvas setup
////////////////////////////////////////////////////////////
const canvas = ref(null);

let ctx;
let animationId;

const DPR = 1;

let W = 0;
let H = 0;

////////////////////////////////////////////////////////////
// Mouse system
////////////////////////////////////////////////////////////

const mouse = {
  x: 0,
  y: 0,
  active: false,
  pulse: 0
};

function mouseMove(e) {

  const rect = canvas.value.getBoundingClientRect();

  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  mouse.active = true;
}

function mouseLeave() {
  mouse.active = false;
}

function mouseClick() {
  mouse.pulse = 1;
}

////////////////////////////////////////////////////////////
// Layers
////////////////////////////////////////////////////////////

const LAYERS = [
  { speed: 0.2, size: 1, alpha: 0.1 },
  { speed: 0.4, size: 1.5, alpha: 0.2 },
  { speed: 0.7, size: 2, alpha: 0.4 },
  { speed: 1, size: 2.5, alpha: 0.7 },
  { speed: 1.4, size: 3, alpha: 1 }
];

////////////////////////////////////////////////////////////
// Utils
////////////////////////////////////////////////////////////

const GRID = 40;

function snap(v) {
  return Math.round(v / GRID) * GRID;
}

function randomDir() {

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  return dirs[Math.floor(Math.random() * dirs.length)];
}

////////////////////////////////////////////////////////////
// Nodes (circuit points)
////////////////////////////////////////////////////////////

const nodes = [];

class Node {

  constructor(layer) {

    this.layer = layer;

    this.x = snap(Math.random() * W);
    this.y = snap(Math.random() * H);

    this.energy = Math.random();

  }

  update() {

    this.energy += (Math.random() - 0.5) * 0.05;

    this.energy = Math.max(0.2, Math.min(1, this.energy));

  }

  draw(ctx) {

    const r = this.layer.size * 2;

    ctx.beginPath();

    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);

    ctx.fillStyle =
      `rgba(0,255,255,${this.energy * this.layer.alpha})`;

    ctx.shadowColor = "rgba(0,255,255,1)";
    ctx.shadowBlur = 15;

    ctx.fill();

    ctx.shadowBlur = 0;

  }

}

////////////////////////////////////////////////////////////
// Data packets
////////////////////////////////////////////////////////////

const packets = [];

class Packet {

  constructor(layer) {

    this.layer = layer;

    this.reset();

  }

  reset() {

    this.x = snap(Math.random() * W);
    this.y = snap(Math.random() * H);

    this.dir = randomDir();

    this.speed =
      (1 + Math.random() * 2) * this.layer.speed;

    this.tail = [];

    this.maxTail = 30;

  }

  mouseInfluence() {

    if (!mouse.active) return;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    const dist =
      Math.sqrt(dx * dx + dy * dy);

    if (dist < 200) {

      if (Math.abs(dx) > Math.abs(dy))
        this.dir = { x: Math.sign(dx), y: 0 };
      else
        this.dir = { x: 0, y: Math.sign(dy) };

    }

  }

  update() {

    this.mouseInfluence();

    if (Math.random() < 0.03)
      this.dir = randomDir();

    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;

    this.tail.push({ x: this.x, y: this.y });

    if (this.tail.length > this.maxTail)
      this.tail.shift();

    if (
      this.x < 0 ||
      this.y < 0 ||
      this.x > W ||
      this.y > H
    )
      this.reset();

  }

  draw(ctx) {

    const size = this.layer.size;

    for (let i = 0; i < this.tail.length; i++) {

      const p = this.tail[i];

      const alpha =
        (i / this.tail.length) *
        this.layer.alpha;

      ctx.beginPath();

      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

      ctx.fillStyle =
        `rgba(0,255,255,${alpha})`;
      ctx.fill();

    }

    ctx.beginPath();

    ctx.arc(
        this.x,
        this.y,
        size * 1.8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `rgba(0,255,255,${this.layer.alpha})`;

    ctx.shadowColor =
       ` rgba(0,255,255,1)`;

    ctx.shadowBlur = 20;

    ctx.fill();

    ctx.shadowBlur = 0;

  }

}

////////////////////////////////////////////////////////////
// Scanline effect
////////////////////////////////////////////////////////////

let scanY = 0;

function drawScanline() {

  scanY += 1;

  if (scanY > H) scanY = 0;

  const grad =
      ctx.createLinearGradient(
          0,
          scanY - 40,
          0,
          scanY + 40
      );

  grad.addColorStop(0, "transparent");
  grad.addColorStop(0.5, "rgba(0,255,255,0.15)");
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;

  ctx.fillRect(0, scanY - 40, W, 80);

}

////////////////////////////////////////////////////////////
// Grid
////////////////////////////////////////////////////////////

function drawGrid() {

  ctx.strokeStyle =
      "rgba(0,255,255,0.05)";

  for (let x = 0; x < W; x += GRID) {

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();

  }

  for (let y = 0; y < H; y += GRID) {

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();

  }

}

////////////////////////////////////////////////////////////
// Background
////////////////////////////////////////////////////////////

function background() {

  ctx.fillStyle =
      "rgba(2,6,12,0.35)";

  ctx.fillRect(0, 0, W, H);

}

////////////////////////////////////////////////////////////
// Animate
////////////////////////////////////////////////////////////

function animate() {

  background();

  drawGrid();

  drawScanline();

  nodes.forEach(n => {
    n.update();
    n.draw(ctx);
  });

  packets.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  if (mouse.pulse > 0) {

    mouse.pulse -= 0.02;

    ctx.beginPath();

    ctx.arc(
        mouse.x,
        mouse.y,
        200 * mouse.pulse,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        `rgba(0,255,255,${mouse.pulse})`;

    ctx.stroke();

  }

  animationId =
      requestAnimationFrame(animate);

}

////////////////////////////////////////////////////////////
// Resize
////////////////////////////////////////////////////////////

function resize() {

  const rect =
      canvas.value.getBoundingClientRect();

  W = rect.width;
  H = rect.height;

  canvas.value.width = W * DPR;
  canvas.value.height = H * DPR;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

}

////////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////////

onMounted(() => {

  ctx =
      canvas.value.getContext("2d");

  resize();

  window.addEventListener(
      "resize",
      resize
  );

  for (const layer of LAYERS) {

    for (let i = 0; i < 10; i++) {

      nodes.push(new Node(layer));

      packets.push(
          new Packet(layer)
      );

    }

  }

  animate();

});

onUnmounted(() => {

  cancelAnimationFrame(
      animationId
  );

});
</script>

<style scoped>

.bg {

  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;

  background:
      radial-gradient(
          circle at center,
          #02060c,
          #000000
      );

  z-index: -1;

}

</style>