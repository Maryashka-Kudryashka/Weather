import { cloud } from './cloud.js';

const cloudsAmount = 15;
const cloudWidth = 350;
const cloudHeight = 200;
const windSpeed = 0.1;

var c = document.getElementById('clouds');
const ctx = c.getContext('2d');

const w = window.innerWidth;
const h = window.innerHeight;

c.width = w;
c.height = h;

let clouds = generateClouds(cloudsAmount);

function random(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

function generateClouds(amount) {
  const clouds = [];

  for (let i = 0; i <= amount; i++) {
    const getCloudCanvasFn = cloud();
    const startinPosX = random(-cloudWidth, w);
    const startinPosY = random(0, cloudHeight);

    clouds.push([getCloudCanvasFn, startinPosX, startinPosY]);
  }

  return clouds;
}

function updateCloud(cloud, windSpeed) {
  const [fn, x, y] = cloud;

  let newX = x + windSpeed;

  if (newX > w + windSpeed) {
    newX = -cloudWidth;
  }

  return [fn, newX, y];
}

function drawCloud(cloud, context) {
  const [getCloudCanvas, x, y] = cloud;
  const cloudCanvas = getCloudCanvas();
  context.drawImage(cloudCanvas, x, y);
}


export function updateClouds() {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.rect(0, 0, w, 550);
  var grd = ctx.createLinearGradient(150, 0, 150, 650);
  grd.addColorStop(0.0, '#6aaede');
  grd.addColorStop(1.0, '#edf6ff');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, 650);

  clouds.forEach(cloud => drawCloud(cloud, ctx));

  clouds = clouds.map(cloud => updateCloud(cloud, windSpeed));
}
