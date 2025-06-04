import { RubiksCube } from "@/utils/rubiksCube";

export abstract class Move {
  constructor(public prime: boolean) {}
  abstract execute(cube: RubiksCube): void;

  undo(cube: RubiksCube): void {
    this.prime = !this.prime;
    this.execute(cube);
  }

  changePrime() {
    this.prime = !this.prime;
  }

  abstract isOpposite(move: Move): boolean;

  abstract isSame(move: Move): boolean;
}
