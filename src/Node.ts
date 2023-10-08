import P5 from 'p5';
import { pointSize } from './Constants';

export class Node {
  id: number;
  x: number;
  y: number;
  private p5: P5;

  constructor(p5: P5, id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.p5 = p5;
  }

  draw() {
    const p5 = this.p5; // just for convenience

    p5.push();

    p5.noStroke();
    p5.fill('white');
    p5.ellipse(this.x, this.y, pointSize);

    p5.pop();
  }
}
