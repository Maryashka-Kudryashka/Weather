var canvas = document.getElementById("snow");
var ctx = canvas.getContext("2d");
var particlesOnScreen = 500;
var particlesArray = [];
var w, h;
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;

function random(min, max) {
  return min + Math.random() * (max - min + 1);
}

  function clientResize(ev) {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", clientResize);

function createSnowFlakes() {
  for (var i = 0; i < particlesOnScreen; i++) {
    var r  = random(2, 8);
    particlesArray.push({
      x: random(-1, 1.5) * w ,
      y: Math.random() * h,
      opacity: Math.random(),
      speedX: random(-3, 3),
      speedY: r,
      radius: r,
    });
  }
}

function drawSnowFlakes() {
  for (var i = 0; i < particlesArray.length; i++) {
    var gradient = ctx.createRadialGradient(
      particlesArray[i].x,
      particlesArray[i].y,
      0,
      particlesArray[i].x,
      particlesArray[i].y,
      particlesArray[i].radius
    );

    gradient.addColorStop(
      0,
      "rgba(255, 255, 255," + particlesArray[i].opacity + ")"
    ); // white
    gradient.addColorStop(
      0.8,
      "rgba(210, 236, 242," + particlesArray[i].opacity + ")"
    ); // bluish
    gradient.addColorStop(
      1,
      "rgba(237, 247, 249," + particlesArray[i].opacity + ")"
    ); // lighter bluish

    ctx.beginPath();
    ctx.arc(
      particlesArray[i].x,
      particlesArray[i].y,
      particlesArray[i].radius,
      0,
      Math.PI * 2,
      false
    );

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function moveSnowFlakes(windActual) {
  for (var i = 0; i < particlesArray.length; i++) {
    particlesArray[i].x += (particlesArray[i].speedX + windActual * 4);
    particlesArray[i].y += particlesArray[i].speedY;

    if (particlesArray[i].y > h) {
      particlesArray[i].x = random(-1, 1) * w * 1.5;
      particlesArray[i].y = -50;
    }
  }
}

export function updateSnowFall(windActual) {
  ctx.clearRect(0, 0, w, h);
  drawSnowFlakes();
  moveSnowFlakes(windActual);
}

createSnowFlakes();
