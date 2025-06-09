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

  clean(): Algorithm {
    return this;
    // const cleanedMoves = [...this.moves];
    // // remove consecutive opposite moves (means same move with prime)
    // for (let i = 0; i < cleanedMoves.length - 1; i++) {
    //   if (cleanedMoves[i].isOpposite(cleanedMoves[i + 1])) {
    //     cleanedMoves.splice(i, 2);
    //     i--;
    //   }
    // }
    // // Convert three identical moves to one opposite move (e.g., R R R -> R')
    // for (let i = 0; i < cleanedMoves.length - 2; i++) {
    //   if (
    //     cleanedMoves[i].isSame(cleanedMoves[i + 1]) &&
    //     cleanedMoves[i].isSame(cleanedMoves[i + 2])
    //   ) {
    //     const move = cleanedMoves[i];
    //     // Create a new move with opposite prime value
    //     const optimizedMove = new (move.constructor as new (
    //       prime: boolean
    //     ) => Move)(!move.prime);
    //     cleanedMoves.splice(i, 3, optimizedMove);
    //     i--;
    //   }
    // }
    // return new Algorithm(cleanedMoves);
  }

  addMoves(move: Move[]) {
    this.moves.push(...move);
  }

  undo(cube: RubiksCube) {
    [...this.moves].reverse().forEach((move) => move.undo(cube));
  }

  clone(): Algorithm {
    return new Algorithm([...this.moves]);
  }

  toString(): string {
    const moveStrings = this.moves.map((move) => {
      if (move instanceof Algorithm) {
        return `(${move.toString()})`;
      }

      // Get the move type from the class name
      const moveType = move.constructor.name.replace("Move", "");

      // Add prime notation if needed
      return moveType + (move.prime ? "'" : "");
    });

    // Optimize consecutive identical moves (e.g., U U -> U2)
    const optimizedStrings: string[] = [];
    let i = 0;

    while (i < moveStrings.length) {
      const currentMove = moveStrings[i];

      if (i + 1 < moveStrings.length && currentMove === moveStrings[i + 1]) {
        optimizedStrings.push(currentMove + "2");
        i += 2;
      } else {
        optimizedStrings.push(currentMove);
        i++;
      }
    }

    return optimizedStrings.join(" ");
  }

  get length(): number {
    return this.moves.length;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOpposite(_move: Move): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSame(_move: Move): boolean {
    return false;
  }
}
