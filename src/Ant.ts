import { AntTransition } from './AntTransition';
import { Edge } from './Edge';
import { Node } from './Node';
import { deltaTScale, q } from './Constants';

export class Ant {
  startID: number;
  currentNode: Node;
  remainingNodes = new Set();
  edgeMatrix: Edge[][];
  nodes: Node[];

  unvisitedIDs: Set<number> = new Set();
  transitions: AntTransition[] = [];
  distanceWalked = 0;

  constructor(startNode: Node, edgeMatrix: Edge[][], nodes: Node[]) {
    this.startID = startNode.id;
    this.currentNode = startNode;
    this.edgeMatrix = edgeMatrix;
    this.nodes = nodes;
    for (const node of nodes) {
      this.unvisitedIDs.add(node.id);
    }
    this.setVisited(startNode.id); // visit first node
  }

  walk() {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      this.nextNode();
    }
    this.gotoNodeID(this.startID);
    // console.log(this.transitions);
  }

  nextNode() {
    const nextID = this.chooseNextNodeID();
    this.gotoNodeID(nextID);
  }

  chooseNextNodeID() {
    const ps: number[] = [];
    const ids: number[] = [];
    let totalp = 0;
    const viableEdges: Edge[] = this.edgeMatrix[this.currentNode.id];
    // generate un-normalised probabilities
    for (const unvisitedID of this.unvisitedIDs) {
      const p = viableEdges[unvisitedID].p;
      ps.push(p);
      totalp += p;
      ids.push(unvisitedID);
    }
    // normalise ps
    for (let i = 0; i < ps.length; i++) ps[i] = ps[i] / totalp;

    const chosenI = weightedChoice(ps);
    const nextID = ids[chosenI];
    return nextID;
  }

  gotoNodeID(id: number) {
    const distance = this.edgeMatrix[this.currentNode.id][id].distance;
    this.distanceWalked += distance;
    const nextNode = this.nodes[id];
    const transition = new AntTransition(this.currentNode, nextNode);
    this.transitions.push(transition);
    this.setVisited(id);
    this.currentNode = nextNode;
  }

  setVisited(id: number) {
    this.unvisitedIDs.delete(id);
  }

  generateDeltaTs(): IDeltaT[] {
    const deltaTs: IDeltaT[] = [];
    const deltaT = q / this.distanceWalked ** deltaTScale;
    for (const transition of this.transitions) {
      const fromID = transition.fromNode.id;
      const toID = transition.toNode.id;
      deltaTs.push({ fromID, toID, deltaT });
    }
    return deltaTs;
  }
}

function weightedChoice(weights: number[]) {
  const target = Math.random();
  const lastIndex = weights.length - 1;
  let sum = 0;

  for (let i = 0; i < lastIndex; i++) {
    sum += weights[i];
    if (target < sum) {
      return i;
    }
  }

  return lastIndex;
}

export interface IDeltaT {
  fromID: number;
  toID: number;
  deltaT: number;
}
