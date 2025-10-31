const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Track positions of blue dots
let dots = [];

// --- MOUSE EVENTS ---
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  dots.push({x, y});
  draw();
});

canvas.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) { // only when left mouse button is held
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dots.push({x, y});
    draw();
  }
});

// --- TOUCH EVENTS ---
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // prevent scrolling
  const rect = canvas.getBoundingClientRect();
  for (let touch of e.touches) {
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    dots.push({x, y});
  }
  draw();
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  for (let touch of e.touches) {
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    dots.push({x, y});
  }
  draw();
}, {passive: false});

// --- DRAW FUNCTION ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 20, 0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
  }
}
