<template>
  <canvas ref="canvas" class="background-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref(null);
let ctx;
let w, h;
let animationId;

let mouse = { x: 0, y: 0 };

const COLORS = ["#3B82F6", "#1D4ED8", "#1E3A8A"];

class Impulse {
  constructor(depth = 1) {
    this.depth = depth;
    this.reset();
  }

  randomAngle() {
    const angles = [0, Math.PI/2, Math.PI, (3*Math.PI)/2];
    return angles[Math.floor(Math.random() * angles.length)];
  }

  reset() {
    this.points = [];
    this.progress = 0;
    this.opacity = 0;
    this.maxOpacity = 0.5 / this.depth;
    this.speed = (1 + Math.random()) * (1 / this.depth);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

    let x = Math.random() * w;
    let y = Math.random() * h;

    this.points.push({ x, y });

    const segments = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < segments; i++) {
      const angle = this.randomAngle();
      const length = 100 + Math.random() * 150;
      x += Math.cos(angle) * length;
      y += Math.sin(angle) * length;
      this.points.push({ x, y });
    }

    this.totalLength = this.calculateLength();
  }

  calculateLength() {
    let len = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      const dx = this.points[i+1].x - this.points[i].x;
      const dy = this.points[i+1].y - this.points[i].y;
      len += Math.sqrt(dx*dx + dy*dy);
    }
    return len;
  }

  update() {
    const dx = mouse.x - this.points[0].x;
    const dy = mouse.y - this.points[0].y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    let interactionRadius = 200;

    let speedBoost = 1;
    let glowBoost = 1;

    if (dist < interactionRadius) {
      speedBoost = 1.8;
      glowBoost = 1.5;
    }

    this.progress += this.speed * speedBoost;

    if (this.progress < this.totalLength) {
      if (this.opacity < this.maxOpacity * glowBoost) {
        this.opacity += 0.02;
      }
    } else {
      this.opacity -= 0.015;
      if (this.opacity <= 0) this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.lineWidth = 2 / this.depth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.color;

    ctx.shadowBlur = 20 / this.depth;
    ctx.shadowColor = this.color;

    ctx.beginPath();

    let remaining = this.progress;

    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i+1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const segmentLength = Math.sqrt(dx*dx + dy*dy);

      if (remaining > segmentLength) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        remaining -= segmentLength;
      } else {
        const ratio = remaining / segmentLength;
        const x = p1.x + dx * ratio;
        const y = p1.y + dy * ratio;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(x, y);
        break;
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}

let impulses = [];

function resize() {
  w = canvas.value.width = window.innerWidth;
  h = canvas.value.height = window.innerHeight;
}

function init() {
  impulses = [];

  // меньше линий — чище
  for (let i = 0; i < 6; i++) impulses.push(new Impulse(1));
  for (let i = 0; i < 4; i++) impulses.push(new Impulse(1.5));
  for (let i = 0; i < 2; i++) impulses.push(new Impulse(2));
}

function drawBackground() {
  ctx.fillStyle = "#08080B";
  ctx.fillRect(0, 0, w, h);
}

function animate() {
  drawBackground();

  impulses.forEach(i => {
    i.update();
    i.draw();
  });

  animationId = requestAnimationFrame(animate);
}

function handleMouse(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  resize();
  init();
  animate();

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", handleMouse);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resize);
  window.removeEventListener("mousemove", handleMouse);
});
</script>

<style scoped>
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>