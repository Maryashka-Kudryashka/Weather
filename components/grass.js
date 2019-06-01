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
var units;

function random(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

function divide(min = 0, max, units, n) {
  return Math.floor((n - min) / ((max - min) / units));
}

export function generateGrass(weatherConditions) {
  const { isSnow, month } = weatherConditions;
  const isWinter = month == 11 || month == 0 || month == 1 || month == 10 || month == 2;
  if (isSnow) {
    units = w * 1.5;
  }
  if (isWinter) {
    units = w * 4;
  } else {
    units = w * 3.5;
  }
  for (var i = 0; i < units; i++) {
    var y = random(h - 170, h + 40);
    var colorGroup = Math.min(divide(h - 170, h + 41, 6, y), 5);
    var color = colors[colorGroup][random(0, colors[colorGroup].length)];
    var angleGroup = divide(h - 170, h + 41, 10, y);
    var randomNumber = random(10 - angleGroup, 10);
    var angle = random(randomNumber, 5);
    var angle = random(-15, 15);
    var speed = random(2, 6);
    dots.push([random(0, w), y, color, angle, speed]);
  }
  dots.sort((a, b) => a[1] - b[1]);
}

function drawGrass(context, windConfig, grassSize) {
  const wind = windConfig.windActual;
  // const wind = 0.0000001;
  const { width, height } = grassSize;
  dots.forEach(([x, y, fill, angle, speed]) => {
    context.fillStyle = fill;
    context.beginPath();
    context.moveTo(x, y);
    context.quadraticCurveTo(
      x - wind * speed + angle,
      y - height / 2,
      x - width / 2 + wind * speed * 2 + angle,
      y - height + Math.abs(wind * speed + angle)
    );
    context.quadraticCurveTo(
      x - width - wind * speed + angle,
      y - height / 2,
      x - width,
      y
    );

    context.fill();
  });
}

function getGrassCanvas(windConfig, grassSize) {
  const key = parseInt(windConfig.windActual * 60);
  if (!canvases[key]) {
    var m_canvas = document.createElement("canvas");
    m_canvas.width = canvas.width;
    m_canvas.height = canvas.height;
    var m_context = m_canvas.getContext("2d");
    m_context.fillStyle = colors[0][random(0, 2)];
    m_context.beginPath();
    m_context.rect(0, h - 170, w, 450);
    m_context.fillStyle = "#71775b";
    m_context.fill();
    drawGrass(m_context, windConfig, grassSize);
    canvases[key] = m_canvas;
  }
  return canvases[key];
}

export function updateGrass(windConfig, grassSize) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(getGrassCanvas(windConfig, grassSize), 0, 0);
}
