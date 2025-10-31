from js import document, requestAnimationFrame
import math, random

canvas = document.getElementById("game")
ctx = canvas.getContext("2d")

player = {"x": 400, "y": 300, "r": 20}
foods = [{"x": random.randint(0, 800), "y": random.randint(0, 600)} for _ in range(50)]

def draw():
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 800, 600)

    # Draw food
    ctx.fillStyle = "green"
    for f in foods:
        ctx.beginPath()
        ctx.arc(f["x"], f["y"], 4, 0, math.pi * 2)
        ctx.fill()

    # Draw player
    ctx.fillStyle = "blue"
    ctx.beginPath()
    ctx.arc(player["x"], player["y"], player["r"], 0, math.pi * 2)
    ctx.fill()

def update(evt):
    rect = canvas.getBoundingClientRect()
    mx, my = evt.clientX - rect.left, evt.clientY - rect.top
    dx, dy = mx - player["x"], my - player["y"]
    dist = math.hypot(dx, dy)
    if dist > 1:
        player["x"] += dx / 20
        player["y"] += dy / 20

canvas.addEventListener("mousemove", update)

def loop(*args):
    draw()
    requestAnimationFrame(loop)

loop()
