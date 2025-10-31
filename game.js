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

// Create random "country blobs"
for(let i=0; i<blobCount; i++){
  blobs.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: 10 + Math.random()*20,
    color: 'green'
  });
}

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
