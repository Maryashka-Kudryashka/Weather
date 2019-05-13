var canvas = document.getElementById("grass"),
  ctx = canvas.getContext("2d"),
  w = window.innerWidth,
  h = window.innerHeight,
  colors = [
    ["#7f9032", "#6b7f26", "#8c9a46"],
    ["#758e2b", "#758927", "#5f7915"],
    ["#587c09", "#608519", "#668621"],
    ["#828e43", "#48690f", "#4c7207"],
    ["#295502", "#7d8a22", "#5c751e"],
    ["#95a34e", "#30570e", "#193903"]
  ];
canvas.width = w;
canvas.height = h;
const canvases = {};
const dots = [];
const grassWidth = 5;
const grassHeight = 70;
const units = w * 3;

generate(units);

function random(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

function divide(min = 0, max, units, n) {
  return Math.floor((n - min) / ((max - min) / units));
}

function generate(number) {
  for (var i = 0; i < number; i++) {
    var height = random(650, h + 40);
    var colorGroup = Math.min(divide(650, h + 41, 6, height), 5);
    var color = colors[colorGroup][random(0, colors[colorGroup].length)];
    var angle = random(-15, 15);
    var speed = random(2, 6);
    dots.push([random(0, w), height, color, angle, speed]);
  }
  dots.sort((a, b) => a[1] - b[1]);
}

function drawGrass(context, windConfig) {
  const wind = windConfig.windActual;
  dots.forEach(([x, y, fill, angle, speed]) => {
    context.fillStyle = fill;
    context.beginPath();
    context.moveTo(x, y);
    context.quadraticCurveTo(
      x - wind * speed + angle,
      y - grassHeight / 2,
      x - grassWidth / 2 + wind * speed * 2 + angle,
      y - grassHeight + Math.abs(wind * speed + angle) 
    );
    context.quadraticCurveTo(
      x - grassWidth - wind * speed + angle,
      y - grassHeight / 2,
      x - grassWidth,
      y
    );

    context.fill();
  });
}

function getGrassCanvas(windConfig) {
  const key = parseInt(windConfig.windActual * 60);
  if (!canvases[key]) {
    var m_canvas = document.createElement("canvas");
    m_canvas.width = canvas.width;
    m_canvas.height = canvas.height;
    var m_context = m_canvas.getContext("2d");
    m_context.fillStyle = colors[0][random(0, 2)];
    m_context.beginPath();
    m_context.rect(0, 650, w, 450);
    m_context.fillStyle = "#71775b";
    m_context.fill();
    drawGrass(m_context, windConfig);
    canvases[key] = m_canvas;
  }
  return canvases[key];
}

export function updateGrass(windConfig) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(getGrassCanvas(windConfig), 0, 0);
}
