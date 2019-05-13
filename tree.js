let canvasTree = document.getElementById("tree");

const w = window.innerWidth;
const h = window.innerHeight;

canvasTree.width = w;
canvasTree.height = h;
const bendability = 2; // greater than 1. The bigger this number the more the thin branches will bend first

const windStrength = 0.3 * bendability * (200 ** 2 / canvasTree.height ** 2); // wind strength

const canvases = {};
const leavesCanvases = {};

let context = canvasTree.getContext("2d");

let arr = [];
let lines = {};
let leaves = {};
let maxDepth = 13;
const leafDeviation = 60;
const leafHeight = 20;
const branchGroupDepth = 10;
const leavesGroupSize = 2 ** (branchGroupDepth - 1);
const maxAngle = 20;
const minAngle = 15;
const maxBranchLenght = Math.ceil(h / 100);
const minBranchLenght = 1;
const leafBendability = 17;
const treeStart = h - 165;
let leafColorArray = [
  "#b8d23d",
  "#a7c33d",
  "#92a927",
  "#6b8b29",
  "#647a24",
  "#4d6019",
  "#4b6e24",
  "#344c0c",
  "#1e3418",
  "#244626"
];
const leafColorArrayLen = leafColorArray.length;
const colors = leafColorArray.concat(leafColorArray.slice(0).reverse());
let groupCounter = 0;
let branchCounter = 0;

generate(-90, maxDepth, arr);

function divide(min = 0, max, units, n) {
  return Math.min(Math.floor((n - min) / ((max - min) / units)), units);
}

function random(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}
const calcX = (angle, r) => r * Math.cos(angle);
const calcY = (angle, r) => r * Math.sin(angle);

function generate(angle, depth, arr) {
  let randomLeafColor =
    colors[
      divide(0, leavesGroupSize, (leafColorArrayLen - 1) * 2, groupCounter)
    ];
  arr.push({
    angle,
    branchArmLength: random(minBranchLenght, maxBranchLenght),
    color: randomLeafColor
  });

  if (depth === branchGroupDepth) {
    groupCounter = 0;
  }
  if (depth === 0) {
    groupCounter++;
  }
  if (depth != 0) {
    if (depth > 1) {
      generate(angle - random(minAngle, maxAngle), depth - 1, arr);
      generate(angle + random(minAngle, maxAngle), depth - 1, arr);
    } else {
      generate(angle, depth - 1, arr);
    }
  }
}

function branch(x1, y1, arr, depth, windConfig) {
  let { branchArmLength, angle, color } = arr[branchCounter++];
  let { windActual, windX, windY } = windConfig;
  let dir = angle * (Math.PI / 180.0);

  if (depth != 0) {
    const xx = calcX(dir, depth);
    const yy = calcY(dir, depth);
    const windSideWayForce = windX * yy - windY * xx;
    const bendabiityOfCurrentBranch =
      (1 - (depth * 0.7) / (maxDepth * 0.7)) ** bendability;
    dir +=
      windStrength * windActual * bendabiityOfCurrentBranch * windSideWayForce;
    let x2 = x1 + calcX(dir, depth * branchArmLength);
    let y2 = y1 + calcY(dir, depth * branchArmLength);
    lines[depth] = lines[depth] || [];
    lines[depth].push([x1, y1, x2, y2]);

    if (depth > 1) {
      branch(x2, y2, arr, depth - 1, windConfig);
      branch(x2, y2, arr, depth - 1, windConfig);
    } else {
      branch(x2, y2, arr, depth - 1, windConfig);
    }
  } else {
    const xx = calcX(dir, 1);
    const yy = calcY(dir, 1);
    const windSideWayForce = windX * yy - windY * xx;
    const leafAngle = angle + windActual * windSideWayForce * leafBendability;
    leaves[color] = leaves[color] || [];
    leaves[color].push([x1, y1, leafAngle]);
  }
}

function drawLines(context) {
  context.strokeStyle = "#2b1010";

  Object.entries(lines).forEach(([thickness, lines]) => {
    context.lineWidth = thickness * 0.7;
    context.beginPath();

    while (lines.length) {
      const [x1, y1, x2, y2] = lines.pop();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    }

    context.closePath();
    context.stroke();
  });
}

function drawLeaves(context) {
  Object.entries(leaves)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([color, leaves]) => {
      const strokeColorIndex = leafColorArray.indexOf(color);
      const strokeColor =
        strokeColorIndex == leafColorArray.length - 1
          ? "#1f3d21"
          : leafColorArray[strokeColorIndex + 1];
      context.fillStyle = color;
      context.strokeStyle = strokeColor;
      context.beginPath();

      while (leaves.length) {
        const [x, y, angle] = leaves.pop();
        const leafAng = angle * (Math.PI / 180);
        const devAng = leafDeviation * (Math.PI / 180);
        let x2 = x + calcX(leafAng, leafHeight),
          y2 = y + calcY(leafAng, leafHeight),
          x3 = x + calcX(leafAng + devAng, leafHeight / 2),
          y3 = y + calcY(leafAng + devAng, leafHeight / 2),
          x4 = x + calcX(leafAng - devAng, leafHeight / 2),
          y4 = y + calcY(leafAng - devAng, leafHeight / 2);

        context.moveTo(x, y);
        context.quadraticCurveTo(x3, y3, x2, y2);
        context.quadraticCurveTo(x4, y4, x, y);

        context.moveTo(x, y);
        context.lineTo(x2, y2);
      }

      context.closePath();
      context.fill();
      context.stroke();
    });

  


  //   const x = 400;
  //   const y = 400;
  //   const xa = 750;
  //   const angle = -90;
  //   context.fillStyle = "#647a24";
  //   context.strokeStyle = "#4d6019";
  //   const deviation = 60;
  //   const leafHeight = 200;

  //   context.beginPath();

  //   // let x2 = x + calcX(angle, leafHeight),
  //   //   y2 = y + calcY(angle, leafHeight),
  //   //   x3 =
  //   //     x +
  //   //     calcX(angle, leafHeight / 2) +
  //   //     calcX(angle + deviation, leafHeight / 2),
  //   //   y3 =
  //   //     y +
  //   //     calcY(angle, leafHeight / 2) +
  //   //     calcY(angle + deviation, leafHeight / 2),
  //   //   x4 =
  //   //     x +
  //   //     calcX(angle, leafHeight / 2) +
  //   //     calcX(angle - deviation, leafHeight / 2),
  //   //   y4 =
  //   //     y +
  //   //     calcY(angle, leafHeight / 2) +
  //   //     calcY(angle - deviation, leafHeight / 2);

  //   let x2 = x + calcX(angle, leafHeight),
  //   y2 = y + calcY(angle, leafHeight),
  //   x3 =
  //     x +
  //     calcX(angle + deviation, leafHeight / 2),
  //   y3 =
  //     y +
  //     calcY(angle + deviation, leafHeight / 2),
  //   x4 =
  //     x +
  //     calcX(angle - deviation, leafHeight / 2),
  //   y4 =
  //     y +
  //     calcY(angle -
  //        deviation, leafHeight / 2);

  //   let x2a = xa + calcX(angle, leafHeight),
  //     x3a =
  //       xa +
  //       calcX(angle, leafHeight / 2) +
  //       calcX(angle + deviation, leafHeight / 2),
  //     x4a =
  //       xa +
  //       calcX(angle, leafHeight / 2) +
  //       calcX(angle - deviation, leafHeight / 2);

  //   context.moveTo(x, y);
  //   context.quadraticCurveTo(x3, y3, x2, y2);
  //   context.quadraticCurveTo(x4, y4, x, y);

  //   context.moveTo(x, y);
  //   context.lineTo(x2, y2);

  //   // context.moveTo(xa, y);
  //   // context.quadraticCurveTo(x3a, y3, x2a, y2);
  //   // context.quadraticCurveTo(x4a, y4, xa, y);

  //   // context.moveTo(xa, y);
  //   // context.lineTo(x2a, y2);

  //   context.closePath();
  //   context.fill();
  //   context.stroke();
}

function getTreeCanvas(windConfig) {
  const key = parseInt(windConfig.windActual * 60);

  if (!canvases[key]) {
    let m_canvas = document.createElement("canvas");
    m_canvas.width = canvasTree.width;
    m_canvas.height = canvasTree.height;
    let m_context = m_canvas.getContext("2d");
    m_context.beginPath();
    m_context.rect(0, 0, 1500, 1000);
    m_context.fillStyle = "transparent";
    m_context.fill();
    branchCounter = 0;
    branch(w / 2, treeStart, arr, maxDepth, windConfig);
    drawLines(m_context);
    canvases[key] = m_canvas;
  }

  return canvases[key];
}

function getLeavesCanvas(wind) {
  const key = parseInt(wind * 60);

  if (!leavesCanvases[key]) {
    let m_canvas = document.createElement("canvas");
    m_canvas.width = canvasTree.width;
    m_canvas.height = canvasTree.height;
    let m_context = m_canvas.getContext("2d");
    drawLeaves(m_context, wind);
    leavesCanvases[key] = m_canvas;
  }

  return leavesCanvases[key];
}

export function updateTree(windConfig) {
  context.clearRect(0, 0, canvasTree.width, canvasTree.height);
  context.drawImage(getTreeCanvas(windConfig), 0, 0); 
  context.drawImage(getLeavesCanvas(windConfig.windActual), 0, 0);
}
