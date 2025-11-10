const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width/3,
  y: canvas.height/3,
  r: 30,
  color: 'blue'
};

let blobs = [];  // now will hold country blobs

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

// --- LOAD COUNTRIES JSON ---
fetch('countries.json')
  .then(response => response.json())
  .then(data => {
    // Create country blobs
    blobs = data.map(c => ({
      name: c.name,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.sqrt(c.size) * 0.002, // scale to canvas, adjust factor
      color: c.color
    }));
  })
  .catch(err => console.error("Failed to load countries:", err));

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

    // Draw country name
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(b.name, b.x - b.r/2, b.y);
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