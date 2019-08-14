import { treeColors } from "./colorsPalette.js";
import { skyColors } from "./colorsPalette.js";
import { leavesSizes } from "./sizesPalette.js";
import { grassSizes } from "./sizesPalette.js";
import { fetchWeather } from "./api.js";
import { windForceTable } from "./windForceTable.js";
import { rainTable } from "./rainTable.js";

const cloudsMaxSpeed = 3;
// const cloudy = false;

function valueTransformer(aFrom, aTo, bFrom, bTo, aVal) {
  const percentage = ((aVal - aFrom) * 100) / (aTo - aFrom);
  const bVal = (percentage * (bTo - bFrom) / 100) + bFrom; 
  return bVal;
}

export async function weather() {
  const weatherInfo = await fetchWeather();
  const weather = weatherInfo.weather[0];
  const month = new Date().getMonth();
//   const month = 5;
  const actualWind = windForceTable(weatherInfo.wind.speed);
  const wind = valueTransformer(0, 12, 0, cloudsMaxSpeed, actualWind)
  const cloudsAmount = weatherInfo.clouds ? valueTransformer(0, 100, 0, 15, weatherInfo.clouds.all) : 0;
  const cloudy = (weatherInfo.clouds && weatherInfo.clouds.all > 85) || weather.main == "Rain" || weather.main == "Drizzle"
  const treeColor = treeColors[month].cloudy ? cloudy ? treeColors[month].cloudy : treeColors[month].sunny : 0;
  const leavesSize = leavesSizes[month] ? leavesSizes[month] : 0;
  const grassSize = grassSizes[month];
  return {
    wind,
    month,
    weather: weather.main,
    sky: {
      cloudsAmount: cloudsAmount,
      skyColor: cloudy ? skyColors.cloudy : skyColors.sunny,
      wind: wind/4
    },
    rain: {
      isRain: weather.main == "Drizzle" || weather.main == "Rain",
      precipitationAmount: rainTable(weather.id, weather.main),
    },
    tree: {
      treeColor,
      leavesSize
    },
    grassSize,
    isSnow: false,
  };
}
