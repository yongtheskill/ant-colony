import './style.css';
import P5 from 'p5';
import { Graph } from './Graph';
import { canvasSide, drawBest, drawPheromones, setDrawBest, setDrawPheromones } from './Constants';

const sketch = (p5: P5) => {
  const graph = new Graph(p5);
  const bgColour = '#242424';

  p5.setup = () => {
    const canvas = p5.createCanvas(canvasSide, canvasSide);
    canvas.parent('app');

    const nNodes = Number((<HTMLInputElement>document.getElementById('nodes')).value) ?? 10;
    graph.createNRandomNodes(nNodes, canvasSide, canvasSide);
  };

  p5.draw = () => {
    p5.background(bgColour);
    graph.antStep();
    graph.draw();
  };
};

let canvas = new P5(sketch);

declare global {
  interface Window {
    refreshGraph: any;
    togglePheromones: any;
    toggleBest: any;
  }
}

window.refreshGraph = () => {
  canvas.remove();
  canvas = new P5(sketch);
};

window.togglePheromones = () => {
  if (drawPheromones) {
    (<HTMLButtonElement>document.getElementById('pherBtn')).classList.remove('buttonOn');
    setDrawPheromones(false);
    return;
  }
  (<HTMLButtonElement>document.getElementById('pherBtn')).classList.add('buttonOn');
  setDrawPheromones(true);
};

window.toggleBest = () => {
  if (drawBest) {
    (<HTMLButtonElement>document.getElementById('bestBtn')).classList.remove('buttonOn');
    setDrawBest(false);
    return;
  }
  (<HTMLButtonElement>document.getElementById('bestBtn')).classList.add('buttonOn');
  setDrawBest(true);
};
