const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
export const canvasSide = (canvasWidth < canvasHeight ? canvasWidth : canvasHeight) - 70;
export const pointSize = 10;
export const lineSize = 2;
const maxDist = Math.sqrt(canvasSide * canvasSide * 2);
export const initEvaporationConstant = 0.6; // proportion of pheromone left after one run
export const evaporationConstantStep = 0.000000001;
export const maxEvaporationConstant = 0.8;
export const q = maxDist / 4; // deltaT update factor, deltaT = q/distance
export const deltaTScale = 1.2;
export const alpha = 1.05; // influence of pheromone, >= 0, generall 0.5-5
export const beta = 6; // influence of distance, >= 1, generall 1-5
export const antCount = 20;

export let drawPheromones = true;
export let drawBest = false;

export const setDrawPheromones = (val: boolean) => {
  drawPheromones = val;
};
export const setDrawBest = (val: boolean) => {
  drawBest = val;
};
