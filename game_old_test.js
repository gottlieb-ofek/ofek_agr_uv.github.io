const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width/3,
  y: canvas.height/3,
  r: 30,
  color: 'blue'
};

const blobs = [];
const blobCount = 10;

function drawCurvedLabel(ctx, text, x, y, radius) {
  radius = 30;
  const letters = text.split("");
  const arcRadius = 2*radius;      // how far above circle
  const arcWidth = Math.PI / 3;       // how wide the curve is (30°)
  const startAngle = -arcWidth / 2;

  for (let i = 0; i < letters.length; i++) {
    const angle = startAngle + (i / (letters.length - 1)) * arcWidth;

    const lx = x + arcRadius * Math.cos(angle - Math.PI / 2);
    const ly = y + arcRadius * Math.sin(angle - Math.PI / 2);

    ctx.fillText(letters[i], lx, ly);
  }
}


fetch('countries.json')
  .then(response => response.json())
  .then(countries => {
    for (let c of countries) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: c.size / 5000,
        color: c.color,
        name: c.name,
        size: c.size
      });
    }

    // ✅ you can now use blobs[] (draw them, print, etc)
    console.log(blobs);
  });

let mouse = {x: canvas.width/2, y: canvas.height/2};

// Mouse & touch events
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  if(e.touches.length>0){
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }
}, {passive:false});

// Update function
function update(){
  // Move player toward mouse
  let dx = mouse.x - player.x;
  let dy = mouse.y - player.y;
  player.x += dx * 0.05;
  player.y += dy * 0.05;

  // Collision check: player eats blobs
  for(let i=blobs.length-1; i>=0; i--){
    let b = blobs[i];
    let dist = Math.hypot(player.x - b.x, player.y - b.y);
    if(dist < player.r + b.r){
      if(player.r > b.r){ // eat smaller
        player.r += b.r*0.2;
        blobs.splice(i,1);
      } else { // smaller blob blocks or optional game over
        // do nothing for now
      }
    }
  }
}

// Draw everything
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw blobs
  for(let b of blobs){
    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.fillStyle = b.color;
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    drawCurvedLabel(ctx, b.name, b.x, b.y, b.r + 8);
  }

  // Draw player
  ctx.beginPath();
  ctx.arc(player.x,player.y,player.r,0,Math.PI*2);
  ctx.fillStyle = player.color;
  ctx.fill();
}

// Game loop
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
