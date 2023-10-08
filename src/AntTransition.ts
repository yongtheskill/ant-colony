import { Node } from './Node';

export class AntTransition {
  fromNode: Node;
  toNode: Node;
  constructor(fromNode: Node, toNode: Node) {
    this.fromNode = fromNode;
    this.toNode = toNode;
  }
}
