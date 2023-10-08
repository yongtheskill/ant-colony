import { Ant, IDeltaT } from './Ant';
import { Edge } from './Edge';
import { Node } from './Node';
import P5 from 'p5';
import {
  initEvaporationConstant,
  maxEvaporationConstant,
  antCount,
  evaporationConstantStep,
  drawBest,
  drawPheromones,
} from './Constants';
import { AntTransition } from './AntTransition';

export class Graph {
  private nodes: Node[] = [];
  private edgeMatrix: Edge[][] = []; // [from][to]
  private evaporationConstant = initEvaporationConstant;
  private bestTransitions: AntTransition[] = [];

  private p5: P5;
  constructor(p5: P5) {
    this.p5 = p5;
  }

  createNRandomNodes(n: number, maxX: number, maxY: number) {
    const edgeBound = 10;
    for (let i = 0; i < n; i++) {
      const x = Math.floor(Math.random() * (maxX - edgeBound * 2)) + edgeBound;
      const y = Math.floor(Math.random() * (maxY - edgeBound * 2)) + edgeBound;
      this.addNode(i, x, y);
    }
    this.generateEdges();
  }

  addNode(id: number, x: number, y: number) {
    const node = new Node(this.p5, id, x, y);
    this.nodes.push(node);
  }

  private generateEdges() {
    for (const fromNode of this.nodes) {
      const froms: Edge[] = [];
      for (const toNode of this.nodes) {
        froms.push(new Edge(this.p5, fromNode, toNode));
      }
      this.edgeMatrix.push(froms);
    }
  }

  antStep() {
    if (this.evaporationConstant < maxEvaporationConstant) {
      this.evaporationConstant += evaporationConstantStep;
    }

    const ants: Ant[] = [];
    for (let i = 0; i < antCount; i++) {
      const ant = new Ant(this.nodes[0], this.edgeMatrix, this.nodes);
      ants.push(ant);
      ant.walk();
    }

    // update pheromones
    let shortestPathLength = Infinity;
    let bestAnt: Ant = ants[0];
    const deltaTs: IDeltaT[] = [];
    for (const ant of ants) {
      if (ant.distanceWalked < shortestPathLength) {
        shortestPathLength = ant.distanceWalked;
        bestAnt = ant;
      }
      const antDeltaTs = ant.generateDeltaTs();
      deltaTs.push(...antDeltaTs);
    }
    this.bestTransitions = bestAnt.transitions;

    // generate current pheromoneMatrix
    const evaporatedPheromoneMatrix: number[][] = [];
    for (const row of this.edgeMatrix) {
      const pheromoneRow: number[] = [];
      for (const edge of row) {
        pheromoneRow.push(edge.pheromone * this.evaporationConstant);
      }
      evaporatedPheromoneMatrix.push(pheromoneRow);
    }

    for (const deltaT of deltaTs) {
      evaporatedPheromoneMatrix[deltaT.fromID][deltaT.toID] += deltaT.deltaT;
    }

    // sync updated matrix with edges
    const nNodes = this.nodes.length;
    for (let fromID = 0; fromID < nNodes; fromID++)
      for (let toID = 0; toID < nNodes; toID++)
        this.edgeMatrix[fromID][toID].setPheromone(evaporatedPheromoneMatrix[fromID][toID]);
  }

  draw() {
    const p5 = this.p5;
    p5.push();

    if (drawPheromones) for (const row of this.edgeMatrix) for (const edge of row) edge.draw();

    if (drawBest)
      for (const transition of this.bestTransitions)
        this.edgeMatrix[transition.fromNode.id][transition.toNode.id].drawHighlight();

    for (const node of this.nodes) node.draw();

    p5.pop();
  }
}
