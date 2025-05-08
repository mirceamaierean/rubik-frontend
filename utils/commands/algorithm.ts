import { Move } from "./move";
import { RubiksCube } from "@/utils/rubiksCube";

export class Algorithm extends Move {
  private moves: Move[];

  constructor(moves: Move[]) {
    super(false);
    this.moves = moves;
  }

  execute(cube: RubiksCube) {
    this.moves.forEach((move) => move.execute(cube));
  }

  addMove(move: Move) {
    this.moves.push(move);
  }

  undo(cube: RubiksCube) {
    [...this.moves].reverse().forEach((move) => move.undo(cube));
  }
}
