import P5 from 'p5';
import { Node } from './Node';
import { alpha, beta, lineSize } from './Constants';

export class Edge {
  fromNode: Node;
  toNode: Node;
  distance: number;
  distanceScore: number;
  p = 1;
  pheromone = 1;
  private p5: P5;
  private drawWeight = lineSize;

  constructor(p5: P5, fromNode: Node, toNode: Node) {
    this.p5 = p5;
    this.fromNode = fromNode;
    this.toNode = toNode;
    const xDist = fromNode.x - toNode.x;
    const yDist = fromNode.y - toNode.y;
    this.distance = Math.sqrt(xDist * xDist + yDist * yDist);
    this.distanceScore = (1 / this.distance) ** beta;
    this.setPheromone(1);
  }

  setPheromone(value: number) {
    this.pheromone = value;
    this.p = this.pheromone ** alpha * this.distanceScore;
  }

  draw() {
    const p5 = this.p5; // just for convenience

    p5.push();

    p5.strokeWeight(this.drawWeight);
    p5.stroke(255, this.pheromone * 100);
    p5.line(this.fromNode.x, this.fromNode.y, this.toNode.x, this.toNode.y);

    p5.pop();
  }

  drawHighlight() {
    const p5 = this.p5; // just for convenience

    p5.push();

    p5.strokeWeight(this.drawWeight);
    p5.stroke(255, 200);
    p5.line(this.fromNode.x, this.fromNode.y, this.toNode.x, this.toNode.y);

    p5.pop();
  }
}
