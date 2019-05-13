import { updateTree } from "./tree.js";
import { updateGrass } from "./grass.js";
import { updateClouds } from "./clouds.js";
import { updateSnowFall } from "./snow.js";
import { updateRain } from "./rain.js";

window.addEventListener("load", () => {
  const windX = -1; // wind direction vector
  const windY = 0;
  const windBendRectSpeed = 0.01; // how fast the tree reacts to the wing
  const windBranchSpring = 0.98; // the amount and speed of the branch spring back

  const gustProbability = 2 / 100; // how often there is a gust of wind

  var windCycle = 0;
  var windCycleGust = 0;
  var windCycleGustTime = 0;
  var currentWind = 0;
  var windFollow = 0;
  var windActual = 0;


  function updateWind() {
    if (Math.random() < gustProbability) {
      windCycleGustTime = (Math.random() * 10 + 1) | 0;
    }
    if (windCycleGustTime > 0) {
      windCycleGustTime--;
      windCycleGust += windCycleGustTime / 20;
    } else {
      windCycleGust *= 0.99;
    }
    windCycle += windCycleGust;
    currentWind = (Math.sin(windCycle / 40) * 0.6 + 0.4) ** 2;
    currentWind = currentWind < 0 ? 0 : currentWind;
    windFollow += (currentWind - windActual) * windBendRectSpeed;
    windFollow *= windBranchSpring;
    windActual += windFollow;
    // windActual = Math.max(0, windActual);
  }

  (function init() {
    const from = -80;
    const to = 80;

    for (let i = from; i <= to; i++) {
      const windActual = i / 60;
      const windConfig = { windActual, windX: -1, windY: 0 };
      updateGrass(windConfig);
    }

    for (let i = from; i <= to; i++) {
      const windActual = i / 60;
      const windConfig = { windActual, windX: -1, windY: 0 };
      updateTree(windConfig);
    }
  })()

  function update() {
    var windConfig = { windActual, windX, windY }
    updateTree(windConfig);
    updateGrass(windConfig);
    updateClouds();
    // updateSnowFall(windActual);
    // updateRain(windConfig);
    updateWind();
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
});